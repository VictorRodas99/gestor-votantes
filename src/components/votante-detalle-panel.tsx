import Avatar from '@mui/material/Avatar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useState, type ReactNode } from 'react'
import { useLocalesVotacion } from '../hooks/services/catalogos'
import { useVotante } from '../hooks/services/votantes'
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

/** Campo de solo lectura: etiqueta en negrita + valor en caja (estilo del wizard). */
function DetailField({
  label,
  value
}: {
  label: string
  value: string | number | null | undefined
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-label-md font-semibold text-text-primary">
        {label}
      </span>
      <span className="rounded-lg border border-divider bg-surface-container-lowest px-4 py-3 text-body-lg text-text-primary">
        {fallback(value)}
      </span>
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

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Avatar className="size-14 bg-primary text-body-md font-semibold text-white">
          {getInitials(votante.nombre, votante.apellido)}
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
          <DetailField label="Nacimiento" value={votante.fechaNacimiento} />
          <DetailField
            label="Sexo"
            value={SEXO_LABEL[votante.sexo] ?? votante.sexo}
          />
          <DetailField label="Celular" value={votante.celular} />
          <DetailField
            label="Dirección"
            value={parsearDireccion(votante.direccion).calle}
          />
        </TabPanel>
      )}

      {tab === 1 && (
        <TabPanel>
          <DetailField label="Local de votación" value={local?.denominacion} />
          <div className="grid grid-cols-2 gap-3">
            <DetailField label="Boleta" value={votante.boleta} />
            <DetailField label="Talón" value={votante.talon} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <DetailField label="Mesa" value={votante.mesa} />
            <DetailField label="Orden" value={votante.orden} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <DetailField
              label="Voto seguro"
              value={votante.votoSeguro ? 'Sí' : 'No'}
            />
            <DetailField
              label="Afiliado"
              value={votante.afiliado ? 'Sí' : 'No'}
            />
          </div>
          <DetailField
            label="Requiere transporte"
            value={votante.requiereTransporte ? 'Sí' : 'No'}
          />
        </TabPanel>
      )}

      {tab === 2 && (
        <TabPanel>
          <DetailField
            label="Encargado de visita"
            value={votante.encargadoVisita}
          />
          <DetailField label="Tipo de visita" value={votante.tipoVisita} />
          <DetailField label="Observación" value={votante.observacion} />
        </TabPanel>
      )}
    </div>
  )
}

export default VotanteDetallePanel
