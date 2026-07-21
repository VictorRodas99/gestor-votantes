import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import MapRoundedIcon from '@mui/icons-material/MapRounded'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { lazy, Suspense, useState } from 'react'
import { Controller, useFormContext, useFormState } from 'react-hook-form'
import { toast } from 'sonner'
import { useDebounce } from 'use-debounce'
import { BUSQUEDA_DEBOUNCE_MS } from '../../constants/geocoding'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import { useBuscarDirecciones } from '../../hooks/services/geocoding'
import { useUbicacionVotante } from '../../hooks/use-ubicacion-votante'
import type { DireccionSugerida } from '../../types/geocoding'
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
    aplicarSugerencia,
    capturarUbicacion
  } = useUbicacionVotante()
  const { errors } = useFormState({ control, name: 'direccion.lat' })
  const coordenadasError = errors.direccion?.lat?.message
  const [mapOpen, setMapOpen] = useState(false)

  const [texto, setTexto] = useState('')
  const [textoDebounced] = useDebounce(texto, BUSQUEDA_DEBOUNCE_MS)
  const { data: sugerencias, isFetching } = useBuscarDirecciones(textoDebounced)

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
            <Autocomplete<DireccionSugerida, false, false, true>
              id="direccion"
              freeSolo
              fullWidth
              options={sugerencias ?? []}
              loading={isFetching}
              filterOptions={(opciones) => opciones}
              autoComplete
              includeInputInList
              value={field.value ?? ''}
              getOptionLabel={(opcion) =>
                typeof opcion === 'string' ? opcion : opcion.etiqueta
              }
              onInputChange={(_, valor, motivo) => {
                if (motivo !== 'input') return
                field.onChange(valor)
                setTexto(valor)
              }}
              onChange={(_, opcion) => {
                if (opcion && typeof opcion !== 'string') {
                  aplicarSugerencia(opcion)
                }
              }}
              renderOption={(props, opcion) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { key: _key, ...optionProps } = props
                return (
                  <li {...optionProps} key={opcion.id}>
                    <span className="flex flex-col">
                      <span>{opcion.etiqueta}</span>
                      {opcion.detalle && (
                        <span className="text-label-sm text-text-secondary">
                          {opcion.detalle}
                        </span>
                      )}
                    </span>
                  </li>
                )
              }}
              renderInput={({ slotProps, ...params }) => (
                <TextField
                  {...params}
                  placeholder="Calle y número"
                  error={Boolean(error)}
                  onBlur={field.onBlur}
                  slotProps={{
                    ...slotProps,
                    input: {
                      ...slotProps.input,
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeRoundedIcon className="text-text-secondary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          {(reverseIsPending || isFetching) && (
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
              )}
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
