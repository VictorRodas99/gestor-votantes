import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import WifiOffRoundedIcon from '@mui/icons-material/WifiOffRounded'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import { useCelularTomado } from '../../hooks/services/votantes'
import { FieldShell } from './form-field'

export const MENSAJE_CELULAR_TOMADO =
  'Este número de celular ya está siendo utilizado'

/** Mismo tiempo que la búsqueda por cédula, para que el paso se sienta igual. */
const CELULAR_DEBOUNCE_MS = 400

/**
 * Campo Celular con verificación de que el número no esté cargado en otro
 * votante. La consulta va debounced y cacheada (`useCelularTomado`); el bloqueo
 * real del avance lo hace el paso, no este componente.
 */
export default function CelularField() {
  const { control } = useFormContext<WizardFormData>()
  const celular = useWatch({ control, name: 'celular' }) ?? ''
  const cedula = useWatch({ control, name: 'cedula' }) ?? ''
  const [debounced] = useDebounce(celular, CELULAR_DEBOUNCE_MS)

  // Solo se verifica lo que el usuario terminó de escribir: mientras el
  // debounce no alcanza al valor actual, no hay nada que consultar ni que
  // mostrar (si no, el resultado del número anterior pinta el campo).
  const estable = debounced === celular.trim()
  const { tomado, verificando, verificado, falloVerificacion } =
    useCelularTomado(estable ? debounced : '', cedula)

  return (
    <Controller
      name="celular"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FieldShell
          label="Celular"
          htmlFor="celular"
          error={
            error?.message ?? (tomado ? MENSAJE_CELULAR_TOMADO : undefined)
          }
        >
          <TextField
            {...field}
            // El ref de RHF va al root del TextField; sin esto el `setFocus`
            // del paso, al bloquear por número tomado, no enfoca el input.
            inputRef={field.ref}
            id="celular"
            value={field.value ?? ''}
            type="tel"
            placeholder="Ej: 0991123456"
            error={Boolean(error) || tomado}
            fullWidth
            slotProps={{
              htmlInput: { inputMode: 'tel' },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {verificando && <CircularProgress size={18} />}
                    {!verificando && tomado && (
                      <ErrorOutlineRoundedIcon
                        fontSize="small"
                        className="text-error"
                      />
                    )}
                    {!verificando && verificado && !tomado && (
                      <CheckCircleRoundedIcon
                        fontSize="small"
                        className="text-success"
                      />
                    )}
                    {!verificando && falloVerificacion && (
                      <WifiOffRoundedIcon
                        fontSize="small"
                        className="text-text-secondary"
                      />
                    )}
                  </InputAdornment>
                )
              }
            }}
          />

          {!error && !tomado && verificado && (
            <span className="text-label-sm text-success">
              Número disponible
            </span>
          )}

          {falloVerificacion && (
            <span className="text-label-sm text-text-secondary">
              No pudimos verificar el número
            </span>
          )}
        </FieldShell>
      )}
    />
  )
}
