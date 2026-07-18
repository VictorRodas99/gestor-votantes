import Pagination from '@mui/material/Pagination'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useState } from 'react'
import { VOTANTES_PER_PAGE } from '../constants/config'
import { useVotantesPaged } from '../hooks/services/votantes'
import { formatCedula } from '../lib/format'
import type { VotantesFilters } from '../services/votantes'
import type { Votante } from '../types/votante'
import EmptyState from './empty-state'
import ErrorState from './error-state'
import { VotoEstadoChip } from './votante-chips'
import VotantesLoading from './votantes-loading'

type VotantesListDesktopProps = {
  filters: VotantesFilters
  /** Cédula del votante abierto en el panel/modal (fila resaltada). */
  selectedCedula: string | null
  onSelect: (votante: Votante) => void
}

function VotantesListDesktop({
  filters,
  selectedCedula,
  onSelect
}: VotantesListDesktopProps) {
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
      <TableContainer className="rounded-xl border border-divider">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="text-label-md font-semibold text-text-secondary uppercase">
                Apellido, Nombre
              </TableCell>
              <TableCell className="text-label-md font-semibold text-text-secondary uppercase">
                CI
              </TableCell>
              <TableCell className="text-label-md font-semibold text-text-secondary uppercase">
                Estado
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            className={
              isPlaceholderData ? 'opacity-60 transition-opacity' : undefined
            }
          >
            {votantes.map((votante) => (
              <TableRow
                key={votante.id}
                hover
                selected={votante.cedula === selectedCedula}
                onClick={() => onSelect(votante)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium text-text-primary">
                  {votante.apellido}, {votante.nombre}
                </TableCell>
                <TableCell className="text-text-secondary">
                  {formatCedula(votante.cedula)}
                </TableCell>
                <TableCell>
                  <VotoEstadoChip votante={votante} />
                </TableCell>
              </TableRow>
            ))}
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

export default VotantesListDesktop
