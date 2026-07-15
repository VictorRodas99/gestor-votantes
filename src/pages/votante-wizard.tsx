import EmptyState from '../components/empty-state'

// Ruta única con estado interno para los 3 pasos (notes/router.md §8, opción 1).
function VotanteWizard() {
  return (
    <EmptyState
      title="Nuevo votante"
      description="Wizard de alta/enriquecimiento en 3 pasos (en construcción)."
    />
  )
}

export default VotanteWizard
