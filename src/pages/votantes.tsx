import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import EmptyState from '../components/empty-state'
import SearchBar from '../components/search-bar'
import VotanteDetalleDialog from '../components/votante-detalle-dialog'
import VotanteDetallePanel from '../components/votante-detalle-panel'
import VotantesExportMenu from '../components/votantes-export-menu'
import VotantesFilterBar, {
  type VotantesFilterValue
} from '../components/votantes-filter-bar'
import VotantesListDesktop from '../components/votantes-list-desktop'
import VotantesListMobile from '../components/votantes-list-mobile'
import { ESTADO_OPTIONS } from '../constants/votante'
import {
  useVotantesInfinite,
  useVotantesPaged
} from '../hooks/services/votantes'
import { buildSearchFilters } from '../lib/votante-search'
import type { VotantesFilters } from '../services/votantes'
import type { Votante } from '../types/votante'

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

  const [page, setPage] = useState(1)
  const [appliedFilters, setAppliedFilters] = useState(queryFilters)

  if (queryFilters !== appliedFilters) {
    setAppliedFilters(queryFilters)
    setPage(1)
  }

  // Misma query key que las listas: React Query la comparte, así que esto no
  // agrega fetches — solo expone acá qué filas están renderizadas para exportar.
  const paged = useVotantesPaged(queryFilters, page, { enabled: isDesktop })
  const infinite = useVotantesInfinite(queryFilters, { enabled: !isDesktop })

  const visibles = isDesktop
    ? (paged.data?.votantes ?? [])
    : (infinite.data?.pages.flatMap((grupo) => grupo.votantes) ?? [])

  const total = isDesktop
    ? (paged.data?.total ?? 0)
    : (infinite.data?.pages[0]?.total ?? 0)

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
            <VotantesExportMenu
              filters={queryFilters}
              visibles={visibles}
              total={total}
              compacto={!isDesktop}
            />
          </div>

          {isDesktop ? (
            <VotantesListDesktop
              filters={queryFilters}
              selectedCedula={selectedCedula}
              onSelect={openDetalle}
              page={page}
              onPageChange={setPage}
            />
          ) : (
            <VotantesListMobile filters={queryFilters} onSelect={openDetalle} />
          )}
        </div>

        {isLg ? (
          <aside className="sticky top-6 w-96 shrink-0 self-start border-l border-divider pl-6">
            {selectedCedula ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-title-md flex-1 font-semibold text-primary">
                    Detalle del votante
                  </h2>
                  <IconButton
                    aria-label="Cerrar detalle"
                    onClick={closeDetalle}
                    className="text-primary"
                  >
                    <CloseRoundedIcon />
                  </IconButton>
                </div>
                <VotanteDetallePanel cedula={selectedCedula} />
              </div>
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
