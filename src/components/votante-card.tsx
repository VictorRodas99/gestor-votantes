import EditRoundedIcon from '@mui/icons-material/EditRounded'
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import type { ReactNode } from 'react'
import { getAvatarColor } from '../lib/avatar-color'
import { formatCedula, getInitials } from '../lib/format'
import type { Votante } from '../types/votante'
import VotanteChips from './votante-chips'

type VotanteCardProps = {
  votante: Votante
  /** Se dispara al tocar la tarjeta (abrir detalle — hoy pendiente). */
  onSelect: (votante: Votante) => void
  /** Resuelto en la lista */
  localNombre?: string
}

function LineaDato({
  texto,
  icono,
  etiqueta
}: {
  texto: string
  icono: ReactNode
  /** Sufijo tenue (ej. "creó") que no se trunca; el nombre sí. */
  etiqueta?: string
}) {
  return (
    <p className="flex items-center gap-1 text-label-md font-normal text-text-secondary">
      {icono}
      <span className="truncate">{texto}</span>
      {etiqueta ? <span className="shrink-0 opacity-60">{etiqueta}</span> : null}
    </p>
  )
}

function VotanteCard({ votante, onSelect, localNombre }: VotanteCardProps) {
  const hasCelular = votante.celular.length > 0
  // Mismo criterio que el listado desktop: colapsar creador y último editor en
  // una línea cuando coinciden (o falta uno); dos líneas solo si difieren.
  const colapsarEditor =
    !votante.creadoPor ||
    !votante.modificadoPor ||
    votante.creadoPor === votante.modificadoPor
  const unicoEditor = votante.modificadoPor || votante.creadoPor

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
            {getInitials(votante.nombreCompleto)}
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-body-lg font-semibold text-text-primary">
              {votante.nombreCompleto}
            </p>
            <p className="text-body-md text-text-secondary">
              CI: {formatCedula(votante.cedula)}
            </p>
            {localNombre ? (
              <LineaDato
                texto={localNombre}
                icono={
                  <PlaceRoundedIcon fontSize="inherit" className="shrink-0" />
                }
              />
            ) : null}
            {colapsarEditor ? (
              unicoEditor ? (
                <LineaDato
                  texto={unicoEditor}
                  icono={
                    <PersonRoundedIcon fontSize="inherit" className="shrink-0" />
                  }
                />
              ) : null
            ) : (
              <>
                <LineaDato
                  texto={votante.creadoPor}
                  etiqueta="creó"
                  icono={
                    <PersonAddAltRoundedIcon
                      fontSize="inherit"
                      className="shrink-0"
                    />
                  }
                />
                <LineaDato
                  texto={votante.modificadoPor}
                  etiqueta="últ."
                  icono={
                    <EditRoundedIcon fontSize="inherit" className="shrink-0" />
                  }
                />
              </>
            )}
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
