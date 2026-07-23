import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import { formatCedula } from '../../lib/format'
import type { Votante } from '../../types/votante'

type VotanteSeleccionadoCardProps = {
  votante: Votante
  onVolver: () => void
}

function VotanteSeleccionadoCard({
  votante,
  onVolver
}: VotanteSeleccionadoCardProps) {
  return (
    <Paper
      elevation={0}
      className="flex items-center gap-4 rounded-xl bg-surface-container-low p-4"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-primary">
        <PersonRoundedIcon />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-label-sm font-semibold tracking-wide text-primary uppercase">
          Votante seleccionado
        </p>
        <p className="truncate text-body-lg font-semibold text-text-primary">
          {votante.nombreCompleto}
        </p>
        <p className="text-label-md text-text-secondary">
          CI: {formatCedula(votante.cedula)}
        </p>
      </div>

      <IconButton
        onClick={onVolver}
        aria-label="Volver a la búsqueda"
        className="shrink-0"
      >
        <ArrowBackRoundedIcon />
      </IconButton>
    </Paper>
  )
}

export default VotanteSeleccionadoCard
