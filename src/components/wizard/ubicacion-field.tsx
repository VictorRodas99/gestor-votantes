import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import MapRoundedIcon from '@mui/icons-material/MapRounded'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { lazy, Suspense, useState } from 'react'
import { Controller, useFormContext, useFormState } from 'react-hook-form'
import { toast } from 'sonner'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import { useUbicacionVotante } from '../../hooks/use-ubicacion-votante'
import { FieldShell } from './form-field'

// El selector de mapa (Leaflet) se carga solo al abrirlo (chunk aparte).
const MapPicker = lazy(() => import('./map-picker'))

/**
 * Dirección: calle (→ columna `direccion`) + coordenadas (→ columna `mapa` como
 * "lat,lng"). Las coordenadas se capturan por GPS (automático) o eligiendo un
 * punto arbitrario en el mapa (§1.3). En desktop (`lg+`) el punto se elige en el
 * mapa embebido (`MapInline`, columna derecha); ahí el botón de abrir el diálogo
 * se oculta (redundante). El botón GPS se mantiene en todos los breakpoints.
 */
export default function UbicacionField() {
  const { control } = useFormContext<WizardFormData>()
  const {
    lat,
    lng,
    tieneCoordenadas,
    locating,
    reverseIsPending,
    aplicarUbicacion,
    capturarUbicacion
  } = useUbicacionVotante()
  const { errors } = useFormState({ control, name: 'direccion.lat' })
  const coordenadasError = errors.direccion?.lat?.message
  const [mapOpen, setMapOpen] = useState(false)

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
                      {reverseIsPending && (
                        <CircularProgress size={18} className="mr-1" />
                      )}
                      <IconButton
                        onClick={capturarUbicacion}
                        disabled={locating || reverseIsPending}
                        aria-label="Usar mi ubicación (GPS)"
                        color={tieneCoordenadas ? 'primary' : 'default'}
                      >
                        <MyLocationRoundedIcon />
                      </IconButton>
                      {/* En desktop el mapa embebido reemplaza al diálogo. */}
                      <IconButton
                        onClick={() => setMapOpen(true)}
                        aria-label="Elegir en el mapa"
                        color="primary"
                        className="lg:hidden"
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
                {reverseIsPending && ' · buscando dirección…'}
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
