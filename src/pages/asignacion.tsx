import { useSearchParams } from 'react-router-dom'
import AsignacionTabs, {
  type AsignacionTab
} from '../components/asignacion/asignacion-tabs'
import BuscarVotante from '../components/asignacion/buscar-votante'
import PunterosAsignados from '../components/asignacion/punteros-asignados'
import VotanteSeleccionadoCard from '../components/asignacion/votante-seleccionado-card'
import EmptyState from '../components/empty-state'
import ErrorState from '../components/error-state'
import VotanteCardSkeleton from '../components/votante-card-skeleton'
import { useVotante } from '../hooks/services/votantes'
import {
  useRecientesAsignacion,
  type VotanteReciente
} from '../hooks/use-recientes-asignacion'
import type { Votante } from '../types/votante'

function VistaAsignacion({ cedula }: { cedula: string }) {
  const [, setSearchParams] = useSearchParams()
  const { data: votante, isPending, isError, refetch } = useVotante(cedula)

  const volver = () =>
    setSearchParams((prev) => {
      prev.delete('ci')
      return prev
    })

  if (isPending) {
    return (
      <div className="flex flex-col gap-3">
        <VotanteCardSkeleton />
        <VotanteCardSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorState
        title="No pudimos cargar el votante"
        onRetry={() => refetch()}
      />
    )
  }

  if (!votante) {
    return (
      <EmptyState
        title="Votante no encontrado"
        description="Puede que la cédula haya cambiado. Volvé a buscar."
        action={
          <button
            type="button"
            onClick={volver}
            className="text-body-md font-semibold text-primary"
          >
            Volver a la búsqueda
          </button>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <VotanteSeleccionadoCard votante={votante} onVolver={volver} />
      <PunterosAsignados
        votanteId={votante.id}
        votanteNombre={votante.nombreCompleto}
      />
    </div>
  )
}

function AsignacionPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { recientes, registrar } = useRecientesAsignacion()

  const tab = (searchParams.get('tab') as AsignacionTab | null) ?? 'punteros'
  const cedula = searchParams.get('ci')

  const cambiarTab = (siguiente: AsignacionTab) =>
    setSearchParams(
      siguiente === 'punteros' ? {} : { tab: siguiente },
      { replace: true }
    )

  const seleccionar = (reciente: VotanteReciente) => {
    registrar(reciente)
    setSearchParams({ ci: reciente.cedula })
  }

  const seleccionarVotante = (votante: Votante) =>
    seleccionar({
      cedula: votante.cedula,
      nombreCompleto: votante.nombreCompleto
    })

  return (
    <div className="flex flex-col gap-4">
      <AsignacionTabs value={tab} onChange={cambiarTab} />

      {tab === 'brigadas' ? (
        <EmptyState
          title="Brigadas"
          description="La asignación de brigadas está en construcción."
        />
      ) : cedula ? (
        <VistaAsignacion cedula={cedula} />
      ) : (
        <BuscarVotante
          recientes={recientes}
          onSelect={seleccionarVotante}
          onSelectReciente={seleccionar}
        />
      )}
    </div>
  )
}

export default AsignacionPage
