import { useEffect, useRef } from 'react'
import { useViviendasInfinite } from '../hooks/services/viviendas'
import type { ViviendasFilters } from '../services/viviendas'
import type { Vivienda } from '../types/vivienda'
import ErrorState from './error-state'
import ViviendaCard from './vivienda-card'
import ViviendaCardSkeleton from './vivienda-card-skeleton'
import ViviendasLoading from './viviendas-loading'
import ViviendasVacio from './viviendas-vacio'

type ViviendasListMobileProps = {
  filters: ViviendasFilters
  onSelect: (vivienda: Vivienda) => void
}

function ViviendasListMobile({ filters, onSelect }: ViviendasListMobileProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useViviendasInfinite(filters)

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasNextPage) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !isFetchingNextPage) {
        fetchNextPage()
      }
    })
    observer.observe(node)

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return <ViviendasLoading />
  }

  if (isError) {
    return (
      <ErrorState
        title="No pudimos cargar las viviendas"
        description={error.message}
        onRetry={() => refetch()}
      />
    )
  }

  const viviendas = data?.pages.flatMap((group) => group.viviendas) ?? []

  if (viviendas.length === 0) {
    return <ViviendasVacio />
  }

  return (
    <div className="flex flex-col gap-4">
      {viviendas.map((vivienda) => (
        <ViviendaCard
          key={vivienda.id}
          vivienda={vivienda}
          onSelect={onSelect}
        />
      ))}

      {hasNextPage ? (
        <div ref={sentinelRef}>
          {isFetchingNextPage ? <ViviendaCardSkeleton /> : null}
        </div>
      ) : null}
    </div>
  )
}

export default ViviendasListMobile
