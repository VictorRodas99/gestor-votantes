import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { Controller, useFormContext } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import { FieldShell } from './form-field'

/** Selector Masculino/Femenino (columna `sexo` = `'M'`/`'F'`). */
export default function SexoToggle({ disabled }: { disabled?: boolean }) {
  const { control } = useFormContext<WizardFormData>()

  return (
    <Controller
      name="sexo"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FieldShell label="Sexo" error={error?.message}>
          <ToggleButtonGroup
            exclusive
            fullWidth
            color="primary"
            value={field.value ?? null}
            disabled={disabled}
            onChange={(_, value) => {
              if (value) field.onChange(value)
            }}
          >
            <ToggleButton value="M">Masculino</ToggleButton>
            <ToggleButton value="F">Femenino</ToggleButton>
          </ToggleButtonGroup>
        </FieldShell>
      )}
    />
  )
}
