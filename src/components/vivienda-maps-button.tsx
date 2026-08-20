import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import type { ViviendaUbicacion } from '../types/vivienda'

type ViviendaMapsButtonProps = {
  ubicacion: ViviendaUbicacion
}

function ViviendaMapsButton({ ubicacion }: ViviendaMapsButtonProps) {
  if (ubicacion.lat == null || ubicacion.lng == null) return null

  const url = `https://www.google.com/maps/search/?api=1&query=${ubicacion.lat},${ubicacion.lng}`

  return (
    <Tooltip title="Ver en Google Maps">
      <IconButton
        component="a"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        aria-label="Ver ubicación en Google Maps"
        onClick={(event) => event.stopPropagation()}
        className="shrink-0 text-primary"
      >
        <OpenInNewRoundedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  )
}

export default ViviendaMapsButton
