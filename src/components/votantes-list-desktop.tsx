import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import Pagination from '@mui/material/Pagination'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import type { ReactNode } from 'react'
import { VOTANTES_PER_PAGE } from '../constants/config'
import { useLocalesPorId } from '../hooks/services/catalogos'
import { useVotantesPaged } from '../hooks/services/votantes'
import { formatCedula } from '../lib/format'
import type { VotantesFilters } from '../services/votantes'
import type { Votante } from '../types/votante'
import EmptyState from './empty-state'
import ErrorState from './error-state'
import { VotoEstadoChip, YaVotoChip } from './votante-chips'
import VotantesLoading from './votantes-loading'

function LineaTruncada({ texto, icono }: { texto: string; icono: ReactNode }) {
  return (
    <Tooltip title={texto}>
      <span className="flex max-w-48 items-center gap-1">
        {icono}
        <span className="truncate">{texto}</span>
      </span>
    </Tooltip>
  )
}

/**
 * Local y referente comparten columna: con el panel de detalle abierto la
 * tabla queda en ~570px hasta 1536px de viewport, y dos columnas no entran.
 */
function CeldaLocalReferente({
  local,
  referente
}: {
  local: string | undefined
  referente: string
}) {
  if (!local && !referente) {
    return <TableCell className="text-text-secondary">—</TableCell>
  }

  return (
    <TableCell className="text-label-md font-normal text-text-secondary">
      <div className="flex flex-col gap-1">
        {local ? (
          <LineaTruncada
            texto={local}
            icono={<PlaceRoundedIcon fontSize="inherit" className="shrink-0" />}
          />
        ) : null}
        {referente ? (
          <LineaTruncada
            texto={referente}
            icono={
              <PersonRoundedIcon fontSize="inherit" className="shrink-0" />
            }
          />
        ) : null}
      </div>
    </TableCell>
  )
}

type VotantesListDesktopProps = {
  filters: VotantesFilters
  /** Cédula del votante abierto en el panel/modal (fila resaltada). */
  selectedCedula: string | null
  onSelect: (votante: Votante) => void
  /** La página vive arriba: la exportación necesita saber qué filas se ven. */
  page: number
  onPageChange: (page: number) => void
}

function VotantesListDesktop({
  filters,
  selectedCedula,
  onSelect,
  page,
  onPageChange
}: VotantesListDesktopProps) {
  const { data, isLoading, isError, error, refetch, isPlaceholderData } =
    useVotantesPaged(filters, page)
  const locales = useLocalesPorId()

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
              <TableCell className="text-label-md font-semibold text-text-secondary uppercase">
                Local / Referente
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
                  <div className="flex flex-wrap gap-2">
                    <YaVotoChip votante={votante} />
                    <VotoEstadoChip votante={votante} />
                  </div>
                </TableCell>
                <CeldaLocalReferente
                  local={locales.get(votante.localVotacionId)}
                  referente={votante.referenteNombre}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {pageCount > 1 ? (
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => onPageChange(value)}
          color="primary"
          className="self-center"
        />
      ) : null}
    </div>
  )
}

export default VotantesListDesktop
