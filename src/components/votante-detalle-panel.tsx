import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { useLocalesVotacion } from '../hooks/services/catalogos'
import { useReferentePorId } from '../hooks/services/referentes'
import { useVotante } from '../hooks/services/votantes'
import { formatearCodigo } from '../lib/codigo'
import { parsearDireccion } from '../lib/direccion'
import { formatCedula, getInitials } from '../lib/format'
import EmptyState from './empty-state'
import ErrorState from './error-state'
import LoadingState from './loading-state'
import VotanteChips from './votante-chips'

type VotanteDetallePanelProps = {
  cedula: string
}

const SEXO_LABEL: Record<string, string> = { M: 'Masculino', F: 'Femenino' }

/** Muestra un valor o `Sin datos` si viene vacío / `null` / `0` / `NaN`. */
function fallback(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '' || value === 0) {
    return 'Sin datos'
  }
  if (typeof value === 'number' && Number.isNaN(value)) return 'Sin datos'
  return String(value)
}

const siNo = (value: boolean): string => (value ? 'Sí' : 'No')

async function copiarLinkMaps(url: string) {
  try {
    await navigator.clipboard.writeText(url)
    toast.success('Link de Google Maps copiado')
  } catch {
    toast.error('No se pudo copiar el link')
  }
}

/** Campo de solo lectura: etiqueta en negrita + valor en caja (estilo del wizard). */
function DetailField({
  label,
  value,
  action
}: {
  label: string
  value: string | number | null | undefined
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-label-md font-semibold text-text-primary">
        {label}
      </span>
      <div className="flex items-center gap-2 rounded-lg border border-divider bg-surface-container-lowest px-4 py-3">
        <span className="min-w-0 flex-1 truncate text-body-lg text-text-primary">
          {fallback(value)}
        </span>
        {action}
      </div>
    </div>
  )
}

function TabPanel({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>
}

/**
 * Detalle de un votante en **solo lectura**, separado en tabs
 * (Datos Personales · Votación · Visita), igual que los pasos del wizard.
 * Se reutiliza inline en desktop y dentro del `Dialog` en mobile/tablet.
 */
function VotanteDetallePanel({ cedula }: VotanteDetallePanelProps) {
  const {
    data: votante,
    isLoading,
    isError,
    error,
    refetch
  } = useVotante(cedula)
  const { data: locales } = useLocalesVotacion()
  // Antes de los early returns: `useReferentePorId` queda deshabilitado
  // mientras no haya votante o su `referente_id` sea `0`.
  const { data: referente } = useReferentePorId(
    votante?.referenteId || undefined
  )
  const [tab, setTab] = useState(0)

  if (isLoading) return <LoadingState label="Cargando votante…" />

  if (isError) {
    return (
      <ErrorState
        title="No pudimos cargar el votante"
        description={error.message}
        onRetry={() => refetch()}
      />
    )
  }

  if (!votante) {
    return (
      <EmptyState
        title="Votante no encontrado"
        description={`No hay ningún votante con la cédula ${formatCedula(cedula)}.`}
      />
    )
  }

  const local = locales?.find((l) => l.id === votante.localVotacionId)

  const direccionParseada = parsearDireccion(votante.direccion)
  const urlMaps =
    direccionParseada.lat != null && direccionParseada.lng != null
      ? `https://www.google.com/maps/search/?api=1&query=${direccionParseada.lat},${direccionParseada.lng}`
      : null

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Avatar className="size-14 bg-primary text-body-md font-semibold text-white">
          {getInitials(votante.nombreCompleto)}
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-title-md truncate font-semibold text-text-primary">
            {votante.apellido.toUpperCase()}, {votante.nombre}
          </p>
          <p className="text-body-md text-text-secondary">
            CI {formatCedula(votante.cedula)}
          </p>
          <VotanteChips votante={votante} />
        </div>
      </div>

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        variant="fullWidth"
      >
        <Tab label="Datos Personales" />
        <Tab label="Votación" />
        <Tab label="Visita" />
      </Tabs>

      {tab === 0 && (
        <TabPanel>
          <div className="grid grid-cols-2 gap-3">
            <DetailField label="Apellido" value={votante.apellido} />
            <DetailField label="Nombre" value={votante.nombre} />
          </div>
          <DetailField label="Cédula" value={formatCedula(votante.cedula)} />
          <DetailField
            label="Dirección"
            value={direccionParseada.calle}
            action={
              urlMaps && (
                <div className="flex items-center">
                  <IconButton
                    onClick={() => copiarLinkMaps(urlMaps)}
                    size="small"
                    aria-label="Copiar link de Google Maps"
                  >
                    <ContentCopyRoundedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    component="a"
                    href={urlMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    edge="end"
                    aria-label="Ver ubicación en Google Maps"
                  >
                    <OpenInNewRoundedIcon fontSize="small" />
                  </IconButton>
                </div>
              )
            }
          />
          <DetailField label="Nacimiento" value={votante.fechaNacimiento} />
          <DetailField
            label="Sexo"
            value={SEXO_LABEL[votante.sexo] ?? votante.sexo}
          />
          <DetailField label="Nacionalidad" value={votante.nacionalidad} />
          <DetailField label="Celular" value={votante.celular} />
          <DetailField label="Referente" value={referente?.nombreApellido} />
        </TabPanel>
      )}

      {tab === 1 && (
        <TabPanel>
          <DetailField
            label="Código Único"
            value={formatearCodigo(votante.codigo)}
          />
          <DetailField label="Local de votación" value={local?.denominacion} />
          <div className="grid grid-cols-2 gap-3">
            <DetailField label="Boleta" value={votante.boleta} />
            <DetailField label="Talón" value={votante.talon} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <DetailField label="Mesa" value={votante.mesa} />
            <DetailField label="Orden" value={votante.orden} />
          </div>
          <DetailField label="Hora de votación" value={votante.horaVotacion} />
          <div className="grid grid-cols-2 gap-3">
            <DetailField label="Voto seguro" value={siNo(votante.votoSeguro)} />
            <DetailField label="Afiliado" value={siNo(votante.afiliado)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <DetailField
              label="Voto intendente"
              value={siNo(votante.votoIntendente)}
            />
            <DetailField
              label="Voto concejal"
              value={siNo(votante.votoConcejal)}
            />
          </div>
          {/* ANR y Alianza solo significan algo si vota a intendente. */}
          {votante.votoIntendente && (
            <div className="grid grid-cols-2 gap-3">
              <DetailField
                label="ANR"
                value={siNo(votante.votoIntendenteAnr)}
              />
              <DetailField
                label="Alianza"
                value={siNo(votante.votoIntendenteAlianza)}
              />
            </div>
          )}
          <DetailField
            label="Requiere transporte"
            value={siNo(votante.requiereTransporte)}
          />
          <div className="grid grid-cols-2 gap-3">
            <DetailField label="Visitado" value={siNo(votante.visitado)} />
            <DetailField
              label="Volver a visitar"
              value={siNo(votante.volverVisitar)}
            />
          </div>
        </TabPanel>
      )}

      {tab === 2 && (
        <TabPanel>
          {/*
          <DetailField
            label="Encargado de visita"
            value={votante.encargadoVisita}
          />
          */}
          <DetailField label="Fecha de visita" value={votante.fechaVisita} />
          <DetailField label="Tipo de visita" value={votante.tipoVisita} />
          <DetailField label="Observación" value={votante.observacion} />
          <DetailField label="¿Es familiar?" value={siNo(votante.familiar)} />
          {votante.familiar && (
            <DetailField
              label="Nombre de Familiar"
              value={votante.nombreFamiliar}
            />
          )}
          <DetailField label="Inc." value={siNo(votante.inc)} />
          {votante.inc && (
            <DetailField label="Monto de inc." value={votante.valorInc} />
          )}
        </TabPanel>
      )}
    </div>
  )
}

export default VotanteDetallePanel
