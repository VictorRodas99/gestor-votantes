import { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import type { ViviendaFormData } from '../forms/vivienda/vivienda.schema'

export function useUbicacionVivienda() {
  const { control, setValue } = useFormContext<ViviendaFormData>()
  const lat = useWatch({ control, name: 'ubicacion.lat' })
  const lng = useWatch({ control, name: 'ubicacion.lng' })
  const [locating, setLocating] = useState(false)

  const aplicarUbicacion = (nextLat: number, nextLng: number) => {
    setValue('ubicacion.lat', nextLat, {
      shouldDirty: true,
      shouldValidate: true
    })
    setValue('ubicacion.lng', nextLng, {
      shouldDirty: true,
      shouldValidate: true
    })
  }

  const capturarUbicacion = () => {
    if (!navigator.geolocation) {
      toast.error('Este dispositivo no permite geolocalización.')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        aplicarUbicacion(position.coords.latitude, position.coords.longitude)
        setLocating(false)
        toast.success('Ubicación capturada.')
      },
      () => {
        setLocating(false)
        toast.error('No pudimos obtener la ubicación.')
      }
    )
  }

  return {
    lat,
    lng,
    tieneCoordenadas: lat != null && lng != null,
    locating,
    aplicarUbicacion,
    capturarUbicacion
  }
}
