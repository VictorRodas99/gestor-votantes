import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ViviendaDetalleDialog from '../components/vivienda-detalle-dialog'
import ViviendasFilterBar, {
  type ViviendasFilterValue
} from '../components/viviendas-filter-bar'
import ViviendasListDesktop from '../components/viviendas-list-desktop'
import ViviendasListMobile from '../components/viviendas-list-mobile'
import { rangoDesdePreset } from '../lib/rango-fechas'
import type { ViviendasFilters } from '../services/viviendas'
import type { Vivienda } from '../types/vivienda'

function ViviendasNoAtendidasPage() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const [filtro, setFiltro] = useState<ViviendasFilterValue>({ preset: 'mes' })
  const [page, setPage] = useState(1)
  const [seleccionada, setSeleccionada] = useState<Vivienda | null>(null)

  const rango = rangoDesdePreset(filtro.preset, filtro.custom)
  const queryFilters: ViviendasFilters = rango ?? {}

  const onFiltroChange = (value: ViviendasFilterValue) => {
    setFiltro(value)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <ViviendasFilterBar value={filtro} onChange={onFiltroChange} />
        </div>
        <Button
          component={Link}
          to="/viviendas-no-atendidas/nueva"
          variant="contained"
          aria-label="Nueva vivienda"
          className="shrink-0 bg-primary-container text-white"
        >
          <AddRoundedIcon />
        </Button>
      </div>

      {isDesktop ? (
        <ViviendasListDesktop
          filters={queryFilters}
          page={page}
          onPageChange={setPage}
          onSelect={setSeleccionada}
        />
      ) : (
        <ViviendasListMobile filters={queryFilters} onSelect={setSeleccionada} />
      )}

      <ViviendaDetalleDialog
        vivienda={seleccionada}
        onClose={() => setSeleccionada(null)}
      />
    </div>
  )
}

export default ViviendasNoAtendidasPage
