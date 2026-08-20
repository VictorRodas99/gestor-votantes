import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import Card from '@mui/material/Card'
import type { KeyboardEvent } from 'react'
import { formatFechaCorta } from '../lib/date'
import type { Vivienda } from '../types/vivienda'
import ViviendaFoto from './vivienda-foto'
import ViviendaMapsButton from './vivienda-maps-button'

type ViviendaCardProps = {
  vivienda: Vivienda
  onSelect: (vivienda: Vivienda) => void
}

function ViviendaCard({ vivienda, onSelect }: ViviendaCardProps) {
  const tieneDescripcion = vivienda.descripcion !== ''
  const calle = vivienda.ubicacion.calle || 'Sin dirección'

  const abrir = () => onSelect(vivienda)
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      abrir()
    }
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={abrir}
      onKeyDown={onKeyDown}
      aria-label={`Ver descripción de ${calle}`}
      className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
    >
      <ViviendaFoto
        foto={vivienda.foto}
        alt={`Vivienda en ${calle}`}
        className="h-48"
      />

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1 text-body-md font-semibold text-primary">
            <PlaceRoundedIcon fontSize="small" className="shrink-0" />
            <span className="truncate">{calle}</span>
            <ViviendaMapsButton ubicacion={vivienda.ubicacion} />
          </span>
          <span className="shrink-0 text-label-md text-text-secondary">
            {formatFechaCorta(vivienda.createdAt)}
          </span>
        </div>

        {tieneDescripcion ? (
          <p className="line-clamp-3 text-body-md text-text-primary">
            {vivienda.descripcion}
          </p>
        ) : (
          <p className="text-body-md text-text-secondary italic">
            Sin descripción disponible
          </p>
        )}
      </div>
    </Card>
  )
}

export default ViviendaCard
