import Pagination from '@mui/material/Pagination'
import { useState } from 'react'
import { VOTANTES_PER_PAGE } from '../constants/config'
import { useVotantesPaged } from '../hooks/services/votantes'
import type { VotantesFilters } from '../services/votantes'
import type { Votante } from '../types/votante'
import EmptyState from './empty-state'
import ErrorState from './error-state'
import VotanteCard from './votante-card'
import VotantesLoading from './votantes-loading'

type VotantesListDesktopProps = {
  filters: VotantesFilters
  onSelect: (votante: Votante) => void
}

// por el momento se usan las mismas cards pero la versión final tiene que ser una tabla
function VotantesListDesktop({ filters, onSelect }: VotantesListDesktopProps) {
  const [page, setPage] = useState(1)
  const [appliedFilters, setAppliedFilters] = useState(filters)

  if (filters !== appliedFilters) {
    setAppliedFilters(filters)
    setPage(1)
  }

  const { data, isLoading, isError, error, refetch, isPlaceholderData } =
    useVotantesPaged(filters, page)

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

  const votantes = data?.votantes ?? []

  if (votantes.length === 0) {
    return (
      <EmptyState
        title="Sin resultados"
        description="No encontramos votantes con esos criterios. Probá con otra búsqueda o filtro."
      />
    )
  }

  const pageCount = data ? Math.ceil(data.total / VOTANTES_PER_PAGE) : 0

  return (
    <div className="flex flex-col gap-4">
      <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : ''}>
        <div className="flex flex-col gap-4">
          {votantes.map((votante) => (
            <VotanteCard
              key={votante.id}
              votante={votante}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      {pageCount > 1 ? (
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          className="self-center"
        />
      ) : null}
    </div>
  )
}

export default VotantesListDesktop
