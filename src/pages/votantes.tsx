import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useDebounce } from 'use-debounce'
import SearchBar from '../components/search-bar'
import VotantesFilterBar, {
  type VotantesFilterValue
} from '../components/votantes-filter-bar'
import VotantesListDesktop from '../components/votantes-list-desktop'
import VotantesListMobile from '../components/votantes-list-mobile'
import { ESTADO_OPTIONS } from '../constants/votante'
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
  const theme = useTheme()
  // Escritorio → paginación por pasos; móvil/tablet → scroll infinito.
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

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

  const handleSelect = (votante: Votante) => {
    // TODO: navegar al detalle del votante cuando exista (hoy pendiente).
    toast(`Detalle de ${votante.nombreCompleto} — pendiente`)
  }

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        placeholder="Buscar votantes por apellido o CI…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <VotantesFilterBar value={filters} onChange={setFilters} />

      {isDesktop ? (
        <VotantesListDesktop filters={queryFilters} onSelect={handleSelect} />
      ) : (
        <VotantesListMobile filters={queryFilters} onSelect={handleSelect} />
      )}
    </div>
  )
}

export default VotantesPage
