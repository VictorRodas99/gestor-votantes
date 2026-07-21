import { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { matchBarrio } from '../forms/votante/barrio-match'
import type { WizardFormData } from '../forms/votante/wizard.schema'
import type { AddressMeta, DireccionSugerida } from '../types/geocoding'
import { useBarrios } from './services/catalogos'
import { useReverseGeocode } from './services/geocoding'

/**
 * Lógica compartida de captura de ubicación del votante (coordenadas +
 * reverse-geocoding). La consumen tanto el campo Dirección (`UbicacionField`,
 * mobile/tablet con diálogo) como el panel de mapa embebido (`MapInline`,
 * desktop): ambos editan el **mismo** `direccion.lat/lng` del form, de modo que
 * quedan sincronizados por construcción.
 */
export function useUbicacionVotante() {
  const { control, setValue, getValues } = useFormContext<WizardFormData>()
  const lat = useWatch({ control, name: 'direccion.lat' })
  const lng = useWatch({ control, name: 'direccion.lng' })
  const [locating, setLocating] = useState(false)
  const { data: barrios } = useBarrios()
  const reverse = useReverseGeocode()

  const setCoords = (nextLat: number, nextLng: number) => {
    setValue('direccion.lat', nextLat, { shouldDirty: true })
    setValue('direccion.lng', nextLng, { shouldDirty: true })
  }

  /**
   * Empareja el nombre de barrio que devolvió OSM con el catálogo y lo aplica.
   * Nunca pisa un barrio ya elegido: a lo sumo lo sugiere.
   */
  const aplicarBarrio = (barrioNombre: string | null) => {
    const match = matchBarrio(barrioNombre, barrios ?? [])
    if (!match) return

    const barrioActual = getValues('barrio_id')
    if (match.exact && barrioActual == null) {
      setValue('barrio_id', match.item.id, { shouldDirty: true })
      toast.success(`Barrio: ${match.item.denominacion}`)
    } else if (barrioActual !== match.item.id) {
      toast(`¿Barrio: ${match.item.denominacion}?`, {
        action: {
          label: 'Usar',
          onClick: () =>
            setValue('barrio_id', match.item.id, { shouldDirty: true })
        }
      })
    }
  }

  /**
   * Aplica los metadatos del reverse-geocoding sin pisar lo que el usuario ya
   * cargó.
   */
  const aplicarMetadatos = (meta: AddressMeta | null) => {
    if (!meta) return

    if (meta.calle) {
      const calleActual = getValues('direccion.calle')?.trim()
      if (!calleActual) {
        setValue('direccion.calle', meta.calle, {
          shouldDirty: true,
          shouldValidate: true
        })
      } else if (calleActual.toLowerCase() !== meta.calle.toLowerCase()) {
        const sugerida = meta.calle
        toast('Dirección sugerida', {
          description: sugerida,
          action: {
            label: 'Usar',
            onClick: () =>
              setValue('direccion.calle', sugerida, {
                shouldDirty: true,
                shouldValidate: true
              })
          }
        })
      }
    }

    aplicarBarrio(meta.barrioNombre)
  }

  /**
   * Aplica una sugerencia elegida en el buscador de direcciones. A diferencia de
   * `aplicarUbicacion`, **no** dispara reverse-geocoding: la respuesta de
   * `/search` ya trae el `address`, y un reverse podría devolver un `road`
   * distinto del que el usuario acaba de elegir y contradecirlo con un toast.
   */
  const aplicarSugerencia = (sugerencia: DireccionSugerida) => {
    setValue('direccion.calle', sugerencia.etiqueta, {
      shouldDirty: true,
      shouldValidate: true
    })
    setCoords(sugerencia.lat, sugerencia.lng)
    aplicarBarrio(sugerencia.barrioNombre)
  }

  const aplicarUbicacion = (nextLat: number, nextLng: number) => {
    setCoords(nextLat, nextLng)
    reverse.mutate(
      { lat: nextLat, lng: nextLng },
      { onSuccess: aplicarMetadatos }
    )
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
    reverseIsPending: reverse.isPending,
    aplicarUbicacion,
    aplicarSugerencia,
    capturarUbicacion
  }
}
