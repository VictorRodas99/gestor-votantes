import AddRoundedIcon from '@mui/icons-material/AddRounded'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useDebounce } from 'use-debounce'
import EmptyState from '../components/empty-state'
import SearchBar from '../components/search-bar'
import VotanteDetalleDialog from '../components/votante-detalle-dialog'
import VotanteDetallePanel from '../components/votante-detalle-panel'
import VotantesFilterBar, {
  type VotantesFilterValue
} from '../components/votantes-filter-bar'
import VotantesListDesktop from '../components/votantes-list-desktop'
import VotantesListMobile from '../components/votantes-list-mobile'
import { ESTADO_OPTIONS } from '../constants/votante'
import type { VotantesFilters } from '../services/votantes'
import type { Votante } from '../types/votante'

// Si el texto de búsqueda son solo dígitos (con puntos/espacios) → es una cédula
// (filtro exacto)
function buildSearchFilters(search: string): Partial<VotantesFilters> {
  const trimmed = search.trim()
  if (!trimmed) return {}

  const digits = trimmed.replace(/\D/g, '')
  const isCedula = digits.length > 0 && /^[\d.\s]+$/.test(trimmed)

  return isCedula ? { cedula: digits } : { apellido: trimmed }
}

const handleExport = () =>
  toast('La exportación de votantes está en construcción.')

function VotantesPage() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const isLg = useMediaQuery(theme.breakpoints.up('lg'))

  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 400)
  const [filters, setFilters] = useState<VotantesFilterValue>({
    visitado: true
  })
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedCedula = searchParams.get('ci')

  const estado = ESTADO_OPTIONS.find((o) => o.value === filters.estado)

  const queryFilters: VotantesFilters = {
    ...buildSearchFilters(debouncedSearch),
    localVotacionId: filters.localVotacionId,
    visitado: filters.visitado ?? true,
    ...estado?.filters
  }

  // Abrir empuja una entrada al historial → el botón "atrás" cierra el modal.
  const openDetalle = (votante: Votante) =>
    setSearchParams((prev) => {
      prev.set('ci', votante.cedula)
      return prev
    })

  const closeDetalle = () =>
    setSearchParams(
      (prev) => {
        prev.delete('ci')
        return prev
      },
      { replace: true }
    )

  return (
    <>
      <div className="flex gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex gap-2">
            <SearchBar
              placeholder="Buscar votantes por apellido o CI…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Button
              component={Link}
              to="/votantes/nuevo"
              variant="contained"
              aria-label="Nuevo votante"
              className="bg-primary-container text-white"
            >
              <AddRoundedIcon />
            </Button>
          </div>

          <div className="flex items-start gap-3">
            <VotantesFilterBar value={filters} onChange={setFilters} />
            <Button
              variant="outlined"
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={handleExport}
              className="ml-auto hidden shrink-0 rounded-full px-4 lg:inline-flex"
            >
              Exportar
            </Button>
          </div>

          {isDesktop ? (
            <VotantesListDesktop
              filters={queryFilters}
              selectedCedula={selectedCedula}
              onSelect={openDetalle}
            />
          ) : (
            <VotantesListMobile filters={queryFilters} onSelect={openDetalle} />
          )}
        </div>

        {isLg ? (
          <aside className="sticky top-6 w-96 shrink-0 self-start border-l border-divider pl-6">
            {selectedCedula ? (
              <VotanteDetallePanel cedula={selectedCedula} />
            ) : (
              <EmptyState
                title="Seleccioná un votante"
                description="Elegí un votante de la lista para ver su detalle."
              />
            )}
          </aside>
        ) : null}
      </div>

      {!isLg ? (
        <VotanteDetalleDialog cedula={selectedCedula} onClose={closeDetalle} />
      ) : null}
    </>
  )
}

export default VotantesPage
