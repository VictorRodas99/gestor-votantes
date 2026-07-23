import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import type { ReactNode } from 'react'
import { getAvatarColor } from '../../lib/avatar-color'

type PersonaListItemProps = {
  iniciales: string
  /** Semilla estable del color del avatar (normalmente la cédula). */
  seed: string
  titulo: string
  subtitulo: ReactNode
  /** Contenido a la derecha (chevron, botón de baja, label "Ya asignado"). */
  trailing?: ReactNode
  onClick?: () => void
  disabled?: boolean
  ariaLabel?: string
}

/**
 * Fila de persona reutilizable (avatar de iniciales + nombre + subtítulo +
 * acción a la derecha). La comparten recientes, resultados de búsqueda y la
 * lista de punteros del drawer.
 */
function PersonaListItem({
  iniciales,
  seed,
  titulo,
  subtitulo,
  trailing,
  onClick,
  disabled,
  ariaLabel
}: PersonaListItemProps) {
  const contenido = (
    <div className="flex items-center gap-4 p-4">
      <Avatar
        aria-hidden
        className="size-12 shrink-0 text-body-md font-semibold text-white"
        sx={{ bgcolor: getAvatarColor(seed) }}
      >
        {iniciales}
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-md font-semibold text-text-primary">
          {titulo}
        </p>
        <div className="truncate text-label-md text-text-secondary">
          {subtitulo}
        </div>
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  )

  return (
    <Card className={disabled ? 'opacity-60' : undefined}>
      {onClick ? (
        <CardActionArea
          onClick={onClick}
          disabled={disabled}
          aria-label={ariaLabel}
        >
          {contenido}
        </CardActionArea>
      ) : (
        contenido
      )}
    </Card>
  )
}

export default PersonaListItem
