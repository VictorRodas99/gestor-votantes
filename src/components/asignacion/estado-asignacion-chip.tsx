import Skeleton from '@mui/material/Skeleton'
import { Pill } from '../votante-chips'

type EstadoAsignacionChipProps = {
  /** `undefined` mientras se resuelve el estado de la fila. */
  asignado?: boolean
}

/**
 * Estado de asignación de un votante (binario). Azul = tiene puntero(s),
 * amarillo = sin asignar
 */
function EstadoAsignacionChip({ asignado }: EstadoAsignacionChipProps) {
  if (asignado === undefined) {
    return <Skeleton variant="rounded" width={84} height={28} />
  }

  return asignado ? (
    <Pill label="Asignado" className="bg-primary/10 text-primary" />
  ) : (
    <Pill
      label="Sin asignar"
      className="truncate bg-warning/15 text-nowrap text-warning-dark"
    />
  )
}

export default EstadoAsignacionChip
