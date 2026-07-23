import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import IconButton from '@mui/material/IconButton'
import type { PunteroAsignado } from '../../hooks/services/asignaciones-punteros'
import { getInitials } from '../../lib/format'
import PersonaListItem from './persona-list-item'

type PunteroAsignadoCardProps = {
  puntero: PunteroAsignado
  onQuitar: (puntero: PunteroAsignado) => void
}

function PunteroAsignadoCard({ puntero, onQuitar }: PunteroAsignadoCardProps) {
  return (
    <PersonaListItem
      seed={puntero.cedula}
      iniciales={getInitials(puntero.nombreApellido)}
      titulo={puntero.nombreApellido}
      subtitulo={puntero.barrioNombre || 'Sin barrio'}
      trailing={
        <IconButton
          color="error"
          onClick={() => onQuitar(puntero)}
          aria-label={`Quitar a ${puntero.nombreApellido}`}
        >
          <CloseRoundedIcon />
        </IconButton>
      }
    />
  )
}

export default PunteroAsignadoCard
