import Chip from '@mui/material/Chip'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  useDesasignarPuntero,
  usePunterosAsignados,
  type PunteroAsignado
} from '../../hooks/services/asignaciones-punteros'
import type { Votante } from '../../types/votante'
import EmptyState from '../empty-state'
import ErrorState from '../error-state'
import VotanteCardSkeleton from '../votante-card-skeleton'
import AsignarPunteroPicker from './asignar-puntero-picker'
import ConfirmarDesasignarDialog from './confirmar-desasignar-dialog'
import PunteroAsignadoCard from './puntero-asignado-card'

const OVERLINE =
  'text-label-sm font-semibold tracking-wide text-primary uppercase'

function PanelHeader({
  overline,
  titulo
}: {
  overline: string
  titulo: string
}) {
  return (
    <header>
      <p className={OVERLINE}>{overline}</p>
      <p className="text-body-lg font-semibold text-text-primary">{titulo}</p>
    </header>
  )
}

/** 1 votante: asignar + ver/quitar sus punteros (reusa la lógica mobile). */
function PanelDetalle({ votante }: { votante: Votante }) {
  const { punteros, isPending, isError, refetch } = usePunterosAsignados(
    votante.id
  )
  const desasignar = useDesasignarPuntero()
  const [aQuitar, setAQuitar] = useState<PunteroAsignado | null>(null)

  const asignadosIds = new Set(punteros.map((puntero) => puntero.id))
  const total = punteros.length

  const confirmarBaja = async () => {
    if (!aQuitar) return

    try {
      await toast
        .promise(
          desasignar.mutateAsync({
            asignacionId: aQuitar.asignacionId,
            votanteId: votante.id,
            punteroId: aQuitar.id
          }),
          {
            loading: 'Quitando puntero…',
            success: (response) => response.message,
            error: (reason) =>
              reason instanceof Error ? reason.message : 'Ocurrió un error'
          }
        )
        .unwrap()
      setAQuitar(null)
    } catch {
      // El toast mostró el error; mantenemos el dialog para reintentar.
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <PanelHeader overline="Asignando a" titulo={votante.nombreCompleto} />

      <AsignarPunteroPicker
        votanteIds={[votante.id]}
        asignadosIds={asignadosIds}
        mostrarFiltros
      />

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-body-lg font-semibold text-text-primary">
            Punteros asignados
          </h3>
          {total > 0 ? (
            <Chip
              size="small"
              color="primary"
              label={`${total} ${total === 1 ? 'Activo' : 'Activos'}`}
            />
          ) : null}
        </div>

        {isPending ? (
          <div className="flex flex-col gap-2">
            <VotanteCardSkeleton />
            <VotanteCardSkeleton />
          </div>
        ) : isError ? (
          <ErrorState
            title="No pudimos cargar los punteros"
            onRetry={() => refetch()}
          />
        ) : total === 0 ? (
          <p className="text-body-md text-text-secondary">
            Este votante todavía no tiene punteros asignados.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {punteros.map((puntero) => (
              <PunteroAsignadoCard
                key={puntero.asignacionId}
                puntero={puntero}
                onQuitar={setAQuitar}
              />
            ))}
          </div>
        )}
      </section>

      <ConfirmarDesasignarDialog
        open={aQuitar !== null}
        punteroNombre={aQuitar?.nombreApellido}
        votanteNombre={votante.nombreCompleto}
        isPending={desasignar.isPending}
        onConfirm={confirmarBaja}
        onCancel={() => setAQuitar(null)}
      />
    </div>
  )
}

/** N votantes: asignación en lote de un puntero a todos los seleccionados. */
function PanelBulk({ seleccionados }: { seleccionados: Votante[] }) {
  return (
    <div className="flex flex-col gap-5">
      <PanelHeader
        overline="Asignando a"
        titulo={`${seleccionados.length} seleccionados`}
      />
      <AsignarPunteroPicker
        votanteIds={seleccionados.map((votante) => votante.id)}
        mostrarFiltros
      />
    </div>
  )
}

type GestionAsignacionPanelProps = {
  seleccionados: Votante[]
}

function GestionAsignacionPanel({
  seleccionados
}: GestionAsignacionPanelProps) {
  if (seleccionados.length === 0) {
    return (
      <EmptyState
        title="Gestión de Asignación"
        description="Seleccioná votantes de la lista para asignarles un puntero."
      />
    )
  }

  if (seleccionados.length === 1) {
    return <PanelDetalle key={seleccionados[0].id} votante={seleccionados[0]} />
  }

  return <PanelBulk seleccionados={seleccionados} />
}

export default GestionAsignacionPanel
