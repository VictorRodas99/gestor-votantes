import { useParams } from 'react-router-dom'
import EmptyState from '../components/empty-state'

function VotanteDetalle() {
  const { cedula } = useParams()

  return (
    <EmptyState
      title={cedula ? `Votante ${cedula}` : 'Votante'}
      description="Detalle y edición del votante (en construcción)."
    />
  )
}

export default VotanteDetalle
