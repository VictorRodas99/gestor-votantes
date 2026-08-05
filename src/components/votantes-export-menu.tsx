import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState, type MouseEvent } from 'react'
import {
  useExportarVotantes,
  type AlcanceExport
} from '../hooks/use-exportar-votantes'
import { formatNumero } from '../lib/format'
import type { VotantesFilters } from '../services/votantes'
import type { Votante } from '../types/votante'

type VotantesExportMenuProps = {
  filters: VotantesFilters
  /** Filas renderizadas ahora: la página de la tabla o lo cargado en móvil. */
  visibles: Votante[]
  /** Total que matchea los filtros (`total_items`). */
  total: number
  /** Móvil: solo el ícono, sin etiqueta. */
  compacto?: boolean
}

function VotantesExportMenu({
  filters,
  visibles,
  total,
  compacto = false
}: VotantesExportMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { exportar, isPending } = useExportarVotantes({ filters, visibles })

  const abrir = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget)
  const cerrar = () => setAnchorEl(null)

  const elegir = (alcance: AlcanceExport) => {
    exportar(alcance)
    cerrar()
  }

  const icono = isPending ? (
    <CircularProgress size={18} color="inherit" />
  ) : (
    <FileDownloadOutlinedIcon />
  )

  return (
    <>
      {compacto ? (
        <IconButton
          aria-label="Exportar votantes"
          aria-haspopup="menu"
          onClick={abrir}
          disabled={isPending || visibles.length === 0}
          className="ml-auto shrink-0 text-primary"
        >
          {icono}
        </IconButton>
      ) : (
        <Button
          variant="outlined"
          startIcon={icono}
          endIcon={<ArrowDropDownRoundedIcon />}
          aria-label="Exportar votantes"
          aria-haspopup="menu"
          onClick={abrir}
          disabled={isPending || visibles.length === 0}
          className="ml-auto shrink-0 rounded-full px-4"
        >
          Exportar
        </Button>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={cerrar}>
        <MenuItem onClick={() => elegir('visibles')}>
          {compacto ? 'Lo cargado' : 'Página actual'} (
          {formatNumero(visibles.length)})
        </MenuItem>
        <MenuItem onClick={() => elegir('todos')} disabled={total === 0}>
          Todos los resultados ({formatNumero(total)})
        </MenuItem>
      </Menu>
    </>
  )
}

export default VotantesExportMenu
