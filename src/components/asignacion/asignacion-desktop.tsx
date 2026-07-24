import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { ESTADO_OPTIONS } from '../../constants/votante'
import { useSeleccionVotantes } from '../../hooks/use-seleccion-votantes'
import { buildSearchFilters } from '../../lib/votante-search'
import type { VotantesFilters } from '../../services/votantes'
import EmptyState from '../empty-state'
import SearchBar from '../search-bar'
import VotantesFilterBar, {
  type VotantesFilterValue
} from '../votantes-filter-bar'
import AsignacionTabs, { type AsignacionTab } from './asignacion-tabs'
import AsignacionVotantesTable from './asignacion-votantes-table'
import GestionAsignacionPanel from './gestion-asignacion-panel'
import SeleccionToolbar from './seleccion-toolbar'

type AsignacionDesktopProps = {
  tab: AsignacionTab
  onTab: (tab: AsignacionTab) => void
}

function AsignacionDesktop({ tab, onTab }: AsignacionDesktopProps) {
  const [search, setSearch] = useState('')
  const [debounced] = useDebounce(search, 400)
  const [filtros, setFiltros] = useState<VotantesFilterValue>({
    visitado: true
  })
  const { seleccion, toggle, togglePage, limpiar } = useSeleccionVotantes()

  const estado = ESTADO_OPTIONS.find(
    (option) => option.value === filtros.estado
  )
  const queryFilters: VotantesFilters = {
    ...buildSearchFilters(debounced),
    localVotacionId: filtros.localVotacionId,
    visitado: filtros.visitado ?? true,
    ...estado?.filters
  }

  const seleccionados = [...seleccion.values()]
  const selectedIds = new Set(seleccion.keys())

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-md text-text-primary">
        Gestión de Asignación
      </h1>

      <div className="flex items-center justify-between gap-4 border-b border-divider">
        <AsignacionTabs value={tab} onChange={onTab} variant="desktop" />
        {tab === 'punteros' ? (
          <div className="flex min-w-0 items-center gap-3 pb-2">
            <div className="w-72">
              <SearchBar
                placeholder="Buscar votante por cédula o nombre"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <VotantesFilterBar value={filtros} onChange={setFiltros} />
          </div>
        ) : null}
      </div>

      {tab === 'brigadas' ? (
        <EmptyState
          title="Brigadas"
          description="La asignación de brigadas está en construcción."
        />
      ) : (
        <div className="flex gap-6">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <SeleccionToolbar
              count={seleccionados.length}
              onLimpiar={limpiar}
            />
            <AsignacionVotantesTable
              filters={queryFilters}
              selectedIds={selectedIds}
              onToggle={toggle}
              onToggleAllPage={togglePage}
            />
          </div>
          <aside className="sticky top-6 w-96 shrink-0 self-start border-l border-divider pl-6">
            <GestionAsignacionPanel seleccionados={seleccionados} />
          </aside>
        </div>
      )}
    </div>
  )
}

export default AsignacionDesktop
