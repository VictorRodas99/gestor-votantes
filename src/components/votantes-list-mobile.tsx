import { useEffect, useRef } from 'react'
import { useVotantesInfinite } from '../hooks/services/votantes'
import type { VotantesFilters } from '../services/votantes'
import type { Votante } from '../types/votante'
import EmptyState from './empty-state'
import ErrorState from './error-state'
import VotanteCard from './votante-card'
import VotanteCardSkeleton from './votante-card-skeleton'
import VotantesLoading from './votantes-loading'

type VotantesListMobileProps = {
  filters: VotantesFilters
  onSelect: (votante: Votante) => void
}

function VotantesListMobile({ filters, onSelect }: VotantesListMobileProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useVotantesInfinite(filters)

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
    return <VotantesLoading />
  }

  if (isError) {
    return (
      <ErrorState
        title="No pudimos cargar los votantes"
        description={error.message}
        onRetry={() => refetch()}
      />
    )
  }

  const votantes = data?.pages.flatMap((group) => group.votantes) ?? []

  if (votantes.length === 0) {
    return (
      <EmptyState
        title="Sin resultados"
        description="No encontramos votantes con esos criterios. Probá con otra búsqueda o filtro."
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {votantes.map((votante) => (
        <VotanteCard key={votante.id} votante={votante} onSelect={onSelect} />
      ))}

      {hasNextPage ? (
        <div ref={sentinelRef}>
          {isFetchingNextPage ? <VotanteCardSkeleton /> : null}
        </div>
      ) : null}
    </div>
  )
}

export default VotantesListMobile
