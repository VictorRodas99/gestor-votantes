import ViviendaCardSkeleton from './vivienda-card-skeleton'

type ViviendasLoadingProps = {
  count?: number
}

function ViviendasLoading({ count = 6 }: ViviendasLoadingProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ViviendaCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default ViviendasLoading
