import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import MapRoundedIcon from '@mui/icons-material/MapRounded'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { lazy, Suspense, useState } from 'react'
import {
  Controller,
  useFormContext,
  useFormState,
  useWatch
} from 'react-hook-form'
import { toast } from 'sonner'
import { matchBarrio } from '../../forms/votante/barrio-match'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import { useBarrios } from '../../hooks/services/catalogos'
import { useReverseGeocode } from '../../hooks/services/geocoding'
import type { AddressMeta } from '../../types/geocoding'
import { FieldShell } from './form-field'

// El selector de mapa (Leaflet) se carga solo al abrirlo (chunk aparte).
const MapPicker = lazy(() => import('./map-picker'))

/**
 * Dirección: calle (→ columna `direccion`) + coordenadas (→ columna `mapa` como
 * "lat,lng"). Las coordenadas se capturan por GPS (automático) o eligiendo un
 * punto arbitrario en el mapa (§1.3).
 */
export default function UbicacionField() {
  const { control, setValue, getValues } = useFormContext<WizardFormData>()
  const lat = useWatch({ control, name: 'direccion.lat' })
  const lng = useWatch({ control, name: 'direccion.lng' })
  const { errors } = useFormState({ control, name: 'direccion.lat' })
  const coordenadasError = errors.direccion?.lat?.message
  const [locating, setLocating] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const { data: barrios } = useBarrios()
  const reverse = useReverseGeocode()

  const setCoords = (nextLat: number, nextLng: number) => {
    setValue('direccion.lat', nextLat, { shouldDirty: true })
    setValue('direccion.lng', nextLng, { shouldDirty: true })
  }

  /**
   * Aplica los metadatos del reverse-geocoding sin pisar lo que el usuario ya
   * cargó
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

    const match = matchBarrio(meta.barrioNombre, barrios ?? [])
    if (match) {
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
        // setCoords(position.coords.latitude, position.coords.longitude)
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

  const tieneCoordenadas = lat != null && lng != null

  return (
    <>
      <Controller
        name="direccion.calle"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FieldShell
            label="Dirección"
            htmlFor="direccion"
            error={error?.message}
          >
            <TextField
              id="direccion"
              {...field}
              value={field.value ?? ''}
              placeholder="Calle y número"
              error={Boolean(error)}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeRoundedIcon className="text-text-secondary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {reverse.isPending && (
                        <CircularProgress size={18} className="mr-1" />
                      )}
                      <IconButton
                        onClick={capturarUbicacion}
                        disabled={locating || reverse.isPending}
                        aria-label="Usar mi ubicación (GPS)"
                        color={tieneCoordenadas ? 'primary' : 'default'}
                      >
                        <MyLocationRoundedIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => setMapOpen(true)}
                        aria-label="Elegir en el mapa"
                        color="primary"
                      >
                        <MapRoundedIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            {tieneCoordenadas ? (
              <span className="flex items-center gap-1 text-label-sm text-text-secondary">
                <PlaceRoundedIcon fontSize="inherit" />
                {lat!.toFixed(5)}, {lng!.toFixed(5)}
                {reverse.isPending && ' · buscando dirección…'}
              </span>
            ) : (
              coordenadasError && (
                <span className="flex items-center gap-1 text-label-sm text-error">
                  <PlaceRoundedIcon fontSize="inherit" />
                  {coordenadasError}
                </span>
              )
            )}
          </FieldShell>
        )}
      />

      {mapOpen && (
        <Suspense fallback={null}>
          <MapPicker
            open={mapOpen}
            lat={lat}
            lng={lng}
            onClose={() => setMapOpen(false)}
            onConfirm={(nextLat, nextLng) => {
              aplicarUbicacion(nextLat, nextLng)
              setMapOpen(false)
              toast.success('Ubicación seleccionada.')
            }}
          />
        </Suspense>
      )}
    </>
  )
}
