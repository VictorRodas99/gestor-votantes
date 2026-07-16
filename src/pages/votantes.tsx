import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useDebounce } from 'use-debounce'
import EmptyState from '../components/empty-state'
import ErrorState from '../components/error-state'
import SearchBar from '../components/search-bar'
import VotanteCard from '../components/votante-card'
import VotanteCardSkeleton from '../components/votante-card-skeleton'
import VotantesFilterBar, {
  type VotantesFilterValue
} from '../components/votantes-filter-bar'
import { ESTADO_OPTIONS } from '../constants/votante'
import { useVotantes } from '../hooks/services/votantes'
import type { VotantesFilters } from '../services/votantes'
import type { Votante } from '../types/votante'

// Si el texto de búsqueda son solo dígitos (con puntos/espacios) → es una cédula
// (filtro exacto); si no, se busca por apellido (LIKE). Ver documentation.md §5.2.
function buildSearchFilters(search: string): Partial<VotantesFilters> {
  const trimmed = search.trim()
  if (!trimmed) return {}

  const digits = trimmed.replace(/\D/g, '')
  const isCedula = digits.length > 0 && /^[\d.\s]+$/.test(trimmed)

  return isCedula ? { cedula: digits } : { apellido: trimmed }
}

function VotantesPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 400)
  const [filters, setFilters] = useState<VotantesFilterValue>({})

  const queryFilters = useMemo<VotantesFilters>(() => {
    const estado = ESTADO_OPTIONS.find((o) => o.value === filters.estado)

    return {
      ...buildSearchFilters(debouncedSearch),
      localVotacionId: filters.localVotacionId,
      ...estado?.filters
    }
  }, [debouncedSearch, filters])

  const { data, isLoading, isError, error, refetch } = useVotantes(queryFilters)

  const handleSelect = (votante: Votante) => {
    // TODO: navegar al detalle del votante cuando exista (hoy pendiente).
    toast(`Detalle de ${votante.nombreCompleto} — pendiente`)
  }

  const votantes = data?.votantes ?? []

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        placeholder="Buscar votantes por apellido o CI…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <VotantesFilterBar value={filters} onChange={setFilters} />

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <VotanteCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="No pudimos cargar los votantes"
          description={error.message}
          onRetry={() => refetch()}
        />
      ) : votantes.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="No encontramos votantes con esos criterios. Probá con otra búsqueda o filtro."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {votantes.map((votante) => (
            <VotanteCard
              key={votante.id}
              votante={votante}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default VotantesPage
