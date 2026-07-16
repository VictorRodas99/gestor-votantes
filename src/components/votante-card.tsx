import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { formatCedula, getInitials } from '../lib/format'
import type { Votante } from '../types/votante'
import VotanteChips from './votante-chips'

// Paleta determinista para el avatar: cada votante siempre cae en el mismo
// color (por su cédula), dando variedad visual sin ser aleatorio entre renders.
// Colores pensados para texto blanco encima (contraste AA).
const AVATAR_COLORS = ['#004787', '#1e5fa8', '#146c2e', '#7f5700', '#5b3d8a']

function getAvatarColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i)) % AVATAR_COLORS.length
  }
  return AVATAR_COLORS[hash]
}

type VotanteCardProps = {
  votante: Votante
  /** Se dispara al tocar la tarjeta (abrir detalle — hoy pendiente). */
  onSelect: (votante: Votante) => void
}

function VotanteCard({ votante, onSelect }: VotanteCardProps) {
  const hasCelular = votante.celular.length > 0

  return (
    <Card className="relative">
      <CardActionArea
        onClick={() => onSelect(votante)}
        className="p-4"
        aria-label={`Ver detalle de ${votante.nombreCompleto}`}
      >
        <div className="flex items-start gap-4 pr-12">
          <Avatar
            className="size-14 text-body-md font-semibold text-white"
            sx={{ bgcolor: getAvatarColor(votante.cedula) }}
          >
            {getInitials(votante.nombre, votante.apellido)}
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-body-lg font-semibold text-text-primary">
              {votante.nombreCompleto}
            </p>
            <p className="text-body-md text-text-secondary">
              CI: {formatCedula(votante.cedula)}
            </p>
            <VotanteChips votante={votante} />
          </div>
        </div>
      </CardActionArea>

      <div className="absolute top-4 right-4">
        {hasCelular ? (
          <Tooltip title={`Llamar al ${votante.celular}`}>
            <IconButton
              component="a"
              href={`tel:${votante.celular}`}
              aria-label={`Llamar a ${votante.nombreCompleto}`}
              className="text-primary"
            >
              <PhoneRoundedIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>
    </Card>
  )
}

export default VotanteCard
