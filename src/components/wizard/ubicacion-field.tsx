import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import MapRoundedIcon from '@mui/icons-material/MapRounded'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
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
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import { FieldShell } from './form-field'

// El selector de mapa (Leaflet) se carga solo al abrirlo (chunk aparte).
const MapPicker = lazy(() => import('./map-picker'))

/**
 * Dirección: calle (→ columna `direccion`) + coordenadas (→ columna `mapa` como
 * "lat,lng"). Las coordenadas se capturan por GPS (automático) o eligiendo un
 * punto arbitrario en el mapa (§1.3).
 */
export default function UbicacionField() {
  const { control, setValue } = useFormContext<WizardFormData>()
  const lat = useWatch({ control, name: 'direccion.lat' })
  const lng = useWatch({ control, name: 'direccion.lng' })
  const { errors } = useFormState({ control, name: 'direccion.lat' })
  const coordenadasError = errors.direccion?.lat?.message
  const [locating, setLocating] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)

  const setCoords = (nextLat: number, nextLng: number) => {
    setValue('direccion.lat', nextLat, { shouldDirty: true })
    setValue('direccion.lng', nextLng, { shouldDirty: true })
  }

  const capturarUbicacion = () => {
    if (!navigator.geolocation) {
      toast.error('Este dispositivo no permite geolocalización.')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords(position.coords.latitude, position.coords.longitude)
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
                      <IconButton
                        onClick={capturarUbicacion}
                        disabled={locating}
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
              <span className="text-label-sm flex items-center gap-1 text-text-secondary">
                <PlaceRoundedIcon fontSize="inherit" />
                {lat!.toFixed(5)}, {lng!.toFixed(5)}
              </span>
            ) : (
              coordenadasError && (
                <span className="text-label-sm flex items-center gap-1 text-error">
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
              setCoords(nextLat, nextLng)
              setMapOpen(false)
              toast.success('Ubicación seleccionada.')
            }}
          />
        </Suspense>
      )}
    </>
  )
}
