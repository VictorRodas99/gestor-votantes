import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import Button from '@mui/material/Button'
import { VIVIENDAS_PER_PAGE } from '../constants/config'
import { useViviendasPaged } from '../hooks/services/viviendas'
import type { ViviendasFilters } from '../services/viviendas'
import type { Vivienda } from '../types/vivienda'
import ErrorState from './error-state'
import ViviendaCard from './vivienda-card'
import ViviendasLoading from './viviendas-loading'
import ViviendasVacio from './viviendas-vacio'

type ViviendasListDesktopProps = {
  filters: ViviendasFilters
  page: number
  onPageChange: (page: number) => void
  onSelect: (vivienda: Vivienda) => void
}

function ViviendasListDesktop({
  filters,
  page,
  onPageChange,
  onSelect
}: ViviendasListDesktopProps) {
  const { data, isLoading, isError, error, refetch, isPlaceholderData } =
    useViviendasPaged(filters, page)

  if (isLoading) {
    return <ViviendasLoading />
  }

  if (isError) {
    return (
      <ErrorState
        title="No pudimos cargar las viviendas"
        description={error.message}
        onRetry={() => refetch()}
      />
    )
  }

  const viviendas = data?.viviendas ?? []
  // total_items no es fiable, hay página siguiente si esta vino llena
  const hasNext = viviendas.length === VIVIENDAS_PER_PAGE

  return (
    <div className="flex flex-col gap-4">
      {viviendas.length === 0 ? (
        <ViviendasVacio />
      ) : (
        <div
          className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${
            isPlaceholderData ? 'opacity-60 transition-opacity' : ''
          }`}
        >
          {viviendas.map((vivienda) => (
            <ViviendaCard
              key={vivienda.id}
              vivienda={vivienda}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      {page > 1 || hasNext ? (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outlined"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            startIcon={<ChevronLeftRoundedIcon />}
          >
            Anterior
          </Button>
          <span className="text-body-md text-text-secondary">
            Página {page}
          </span>
          <Button
            variant="outlined"
            disabled={!hasNext}
            onClick={() => onPageChange(page + 1)}
            endIcon={<ChevronRightRoundedIcon />}
          >
            Siguiente
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default ViviendasListDesktop
