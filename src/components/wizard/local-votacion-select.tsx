import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Controller, useFormContext } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import { useLocalesVotacion } from '../../hooks/services/catalogos'
import { FieldShell } from './form-field'

type LocalVotacionSelectProps = {
  label?: string
  disabled?: boolean
}

/**
 * Select async del local de votación, enlazado a `local_votacion_id`. Espejo de
 * `barrio-select.tsx`. Es dato del padrón: `disabled` en enriquecimiento.
 */
export default function LocalVotacionSelect({
  label = 'Local de votación',
  disabled
}: LocalVotacionSelectProps) {
  const { control } = useFormContext<WizardFormData>()
  const { data: locales, isLoading } = useLocalesVotacion()

  return (
    <Controller
      name="local_votacion_id"
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selected = locales?.find((l) => l.id === field.value) ?? null

        return (
          <FieldShell label={label} error={error?.message}>
            <Autocomplete
              options={locales ?? []}
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
              noOptionsText="Sin locales disponibles"
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Seleccione un local..."
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
