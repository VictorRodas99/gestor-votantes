import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import { useVotantePorCedula } from '../../hooks/services/votantes'
import { formatCedula } from '../../lib/format'
import type { Votante } from '../../types/votante'
import { FieldShell } from './form-field'

type CedulaSearchProps = {
  /** `'padron'` = votante existente prellenado (cédula bloqueada). */
  origen: 'nuevo' | 'padron'
  onPrefill: (votante: Votante) => void
  onReset: () => void
}

/**
 * Campo Cédula con búsqueda de prefill (§1.1). Al tipear una cédula que existe,
 * ofrece cargar los datos del padrón; una vez cargados, queda de solo lectura.
 */
export default function CedulaSearch({
  origen,
  onPrefill,
  onReset
}: CedulaSearchProps) {
  const { control } = useFormContext<WizardFormData>()
  const cedula = useWatch({ control, name: 'cedula' }) ?? ''
  const [debounced] = useDebounce(cedula, 400)

  const esPadron = origen === 'padron'
  const { data, isFetching } = useVotantePorCedula(esPadron ? '' : debounced)

  const match = data?.votantes?.[0]
  const sugerirPrefill = !esPadron && match?.cedula === debounced

  return (
    <Controller
      name="cedula"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FieldShell label="Cédula" htmlFor="cedula" error={error?.message}>
          <TextField
            id="cedula"
            value={field.value ?? ''}
            onBlur={field.onBlur}
            onChange={(event) =>
              field.onChange(event.target.value.replace(/\D/g, '').slice(0, 8))
            }
            placeholder="Ingrese o busque por cédula"
            disabled={esPadron}
            error={Boolean(error)}
            fullWidth
            slotProps={{
              htmlInput: { inputMode: 'numeric' },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {esPadron ? (
                      <CheckCircleRoundedIcon className="text-success" />
                    ) : (
                      <SearchRoundedIcon className="text-text-secondary" />
                    )}
                  </InputAdornment>
                ),
                endAdornment: isFetching ? (
                  <CircularProgress size={18} />
                ) : undefined
              }
            }}
          />

          {sugerirPrefill && match && (
            <button
              type="button"
              onClick={() => onPrefill(match)}
              className="flex items-center justify-between gap-2 rounded-md border border-primary bg-surface-container-low px-3 py-2 text-left"
            >
              <span className="text-label-md text-text-primary">
                Encontrado:{' '}
                <strong className="font-semibold">
                  {match.nombreCompleto}
                </strong>
                <span className="text-text-secondary">
                  {' '}
                  · {formatCedula(match.cedula)}
                </span>
              </span>
              <span className="shrink-0 text-label-sm font-semibold text-primary">
                Usar datos
              </span>
            </button>
          )}

          {esPadron && (
            <div className="flex items-center justify-between">
              <span className="text-label-sm text-success">
                Datos del padrón cargados (solo lectura)
              </span>
              <Button size="small" onClick={onReset}>
                Cambiar
              </Button>
            </div>
          )}
        </FieldShell>
      )}
    />
  )
}
