import Checkbox from '@mui/material/Checkbox'
import Pagination from '@mui/material/Pagination'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useState } from 'react'
import { VOTANTES_PER_PAGE } from '../../constants/config'
import { useEstadosAsignacion } from '../../hooks/services/asignaciones-punteros'
import { useLocalesVotacion } from '../../hooks/services/catalogos'
import { useVotantesPaged } from '../../hooks/services/votantes'
import { formatCedula } from '../../lib/format'
import type { VotantesFilters } from '../../services/votantes'
import type { Votante } from '../../types/votante'
import EmptyState from '../empty-state'
import ErrorState from '../error-state'
import VotantesLoading from '../votantes-loading'
import EstadoAsignacionChip from './estado-asignacion-chip'

type AsignacionVotantesTableProps = {
  filters: VotantesFilters
  selectedIds: Set<number>
  onToggle: (votante: Votante) => void
  onToggleAllPage: (votantes: Votante[], seleccionar: boolean) => void
}

const HEAD_CELL = 'text-label-md font-semibold text-text-secondary uppercase'

function AsignacionVotantesTable({
  filters,
  selectedIds,
  onToggle,
  onToggleAllPage
}: AsignacionVotantesTableProps) {
  const [page, setPage] = useState(1)
  const [appliedFilters, setAppliedFilters] = useState(filters)

  if (filters !== appliedFilters) {
    setAppliedFilters(filters)
    setPage(1)
  }

  const { data, isLoading, isError, error, refetch, isPlaceholderData } =
    useVotantesPaged(filters, page)
  const { data: locales } = useLocalesVotacion()

  const votantes = data?.votantes ?? []
  const { estados } = useEstadosAsignacion(
    votantes.map((votante) => votante.id)
  )

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

  if (votantes.length === 0) {
    return (
      <EmptyState
        title="Sin resultados"
        description="No encontramos votantes con esos criterios. Probá con otra búsqueda o filtro."
      />
    )
  }

  const pageCount = data ? Math.ceil(data.total / VOTANTES_PER_PAGE) : 0
  const enPagina = votantes.filter((votante) => selectedIds.has(votante.id))
  const todosSeleccionados = enPagina.length === votantes.length
  const algunoSeleccionado = enPagina.length > 0 && !todosSeleccionados

  const nombreLocal = (id: number) =>
    locales?.find((local) => local.id === id)?.denominacion ?? '—'

  return (
    <div className="flex flex-col gap-4">
      <TableContainer className="rounded-xl border border-divider">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={todosSeleccionados}
                  indeterminate={algunoSeleccionado}
                  onChange={() =>
                    onToggleAllPage(votantes, !todosSeleccionados)
                  }
                  aria-label="Seleccionar todos los votantes de la página"
                />
              </TableCell>
              <TableCell className={HEAD_CELL}>Votante</TableCell>
              <TableCell className={HEAD_CELL}>CI</TableCell>
              <TableCell className={HEAD_CELL}>Local</TableCell>
              <TableCell className={HEAD_CELL}>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            className={
              isPlaceholderData ? 'opacity-60 transition-opacity' : undefined
            }
          >
            {votantes.map((votante) => {
              const seleccionado = selectedIds.has(votante.id)
              return (
                <TableRow
                  key={votante.id}
                  hover
                  selected={seleccionado}
                  onClick={() => onToggle(votante)}
                  className="cursor-pointer"
                >
                  <TableCell
                    padding="checkbox"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Checkbox
                      checked={seleccionado}
                      onChange={() => onToggle(votante)}
                      aria-label={`Seleccionar a ${votante.apellido}, ${votante.nombre}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-text-primary">
                    {votante.apellido}, {votante.nombre}
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {formatCedula(votante.cedula)}
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {nombreLocal(votante.localVotacionId)}
                  </TableCell>
                  <TableCell>
                    <EstadoAsignacionChip asignado={estados.get(votante.id)} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

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

export default AsignacionVotantesTable
