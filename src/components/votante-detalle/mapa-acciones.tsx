import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import Button from '@mui/material/Button'
import { useFormContext, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import type { WizardFormData } from '../../forms/votante/wizard.schema'

async function copiarLinkMaps(url: string) {
  try {
    await navigator.clipboard.writeText(url)
    toast.success('Link de Google Maps copiado')
  } catch {
    toast.error('No se pudo copiar el link')
  }
}

/** Abrir / copiar la ubicación en Google Maps. Oculto si no hay coordenadas. */
export default function MapaAcciones() {
  const { control } = useFormContext<WizardFormData>()
  const lat = useWatch({ control, name: 'direccion.lat' })
  const lng = useWatch({ control, name: 'direccion.lng' })

  if (lat == null || lng == null) return null

  const urlMaps = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

  return (
    <div className="-mt-2 flex flex-wrap gap-2">
      <Button
        size="small"
        component="a"
        href={urlMaps}
        target="_blank"
        rel="noopener noreferrer"
        startIcon={<OpenInNewRoundedIcon />}
      >
        Abrir en Google Maps
      </Button>
      <Button
        size="small"
        onClick={() => copiarLinkMaps(urlMaps)}
        startIcon={<ContentCopyRoundedIcon />}
      >
        Copiar link
      </Button>
    </div>
  )
}
