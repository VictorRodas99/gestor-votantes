import VotanteCardSkeleton from './votante-card-skeleton'

type VotantesLoadingProps = {
  count?: number
}

/** Placeholder de carga del listado: N tarjetas skeleton apiladas. */
function VotantesLoading({ count = 5 }: VotantesLoadingProps) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <VotanteCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default VotantesLoading
