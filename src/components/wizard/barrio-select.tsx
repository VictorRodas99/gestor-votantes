import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Controller, useFormContext } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import { useBarrios } from '../../hooks/services/catalogos'
import { FieldShell } from './form-field'

type BarrioSelectProps = {
  label?: string
  disabled?: boolean
}

/**
 * Select async de barrio, enlazado a `barrio_id` (fuente única). El sub-form del
 * referente reusa este mismo path → espejo por construcción (§1.4).
 */
export default function BarrioSelect({
  label = 'Barrio',
  disabled
}: BarrioSelectProps) {
  const { control } = useFormContext<WizardFormData>()
  const { data: barrios, isLoading } = useBarrios()

  return (
    <Controller
      name="barrio_id"
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selected = barrios?.find((b) => b.id === field.value) ?? null

        return (
          <FieldShell label={label} error={error?.message}>
            <Autocomplete
              options={barrios ?? []}
              loading={isLoading}
              disabled={disabled}
              value={selected}
              getOptionLabel={(option) => option.denominacion}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { key: _key, ...optionProps } = props
                return (
                  <li {...optionProps} key={option.id}>
                    {option.denominacion}
                  </li>
                )
              }}
              onChange={(_, option) => field.onChange(option?.id)}
              onBlur={field.onBlur}
              noOptionsText="Sin barrios disponibles"
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Seleccione barrio"
                  error={Boolean(error)}
                />
              )}
            />
          </FieldShell>
        )
      }}
    />
  )
}
