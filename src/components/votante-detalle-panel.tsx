import { useVotante } from '../hooks/services/votantes'
import { formatCedula } from '../lib/format'
import EmptyState from './empty-state'
import ErrorState from './error-state'
import LoadingState from './loading-state'
import VotanteDetalleForm, {
  type VarianteDetalle
} from './votante-detalle/form'

type VotanteDetallePanelProps = {
  cedula: string
  /** `panel` = inline en desktop (scroll propio); `dialog` = modal en mobile. */
  variante: VarianteDetalle
}

/**
 * Carga el votante y monta su detalle editable. Se reutiliza inline en
 * desktop y dentro del `Dialog` en mobile/tablet.
 */
function VotanteDetallePanel({ cedula, variante }: VotanteDetallePanelProps) {
  const {
    data: votante,
    isLoading,
    isError,
    error,
    refetch
  } = useVotante(cedula)

  // Con datos se muestra el form aunque un refetch posterior falle: si no, un
  // error de red tras guardar desmontaría el form con lo que se estaba editando.
  if (votante) {
    return (
      <VotanteDetalleForm
        key={votante.cedula}
        votante={votante}
        variante={variante}
      />
    )
  }

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

  return (
    <EmptyState
      title="Votante no encontrado"
      description={`No hay ningún votante con la cédula ${formatCedula(cedula)}.`}
    />
  )
}

export default VotanteDetallePanel
