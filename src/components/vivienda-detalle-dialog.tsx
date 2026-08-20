import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import { formatFechaCorta } from '../lib/date'
import type { Vivienda } from '../types/vivienda'
import ViviendaFoto from './vivienda-foto'
import ViviendaMapsButton from './vivienda-maps-button'

type ViviendaDetalleDialogProps = {
  vivienda: Vivienda | null
  onClose: () => void
}

function ViviendaDetalleDialog({
  vivienda,
  onClose
}: ViviendaDetalleDialogProps) {
  return (
    <Dialog open={Boolean(vivienda)} onClose={onClose} fullWidth maxWidth="xs">
      {vivienda ? (
        <>
          <ViviendaFoto
            key={vivienda.id}
            foto={vivienda.foto}
            alt={`Vivienda en ${vivienda.ubicacion.calle || 'ubicación sin dirección'}`}
            className="h-56"
          />

          <div className="flex flex-col gap-3 p-5">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-title-md flex items-center gap-1 font-semibold text-primary">
                  <PlaceRoundedIcon fontSize="small" className="shrink-0" />
                  <span className="min-w-0 break-words">
                    {vivienda.ubicacion.calle || 'Sin dirección'}
                  </span>
                  <ViviendaMapsButton ubicacion={vivienda.ubicacion} />
                </p>
                <p className="text-label-md text-text-secondary">
                  {formatFechaCorta(vivienda.createdAt)}
                </p>
              </div>
              <IconButton
                edge="end"
                aria-label="Cerrar"
                onClick={onClose}
                className="text-primary"
              >
                <CloseRoundedIcon />
              </IconButton>
            </div>

            {vivienda.descripcion !== '' ? (
              <p className="text-body-md whitespace-pre-line text-text-primary">
                {vivienda.descripcion}
              </p>
            ) : (
              <p className="text-body-md text-text-secondary italic">
                Sin descripción disponible
              </p>
            )}
          </div>
        </>
      ) : null}
    </Dialog>
  )
}

export default ViviendaDetalleDialog
