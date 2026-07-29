import FamilyRestroomRoundedIcon from '@mui/icons-material/FamilyRestroomRounded'
import Switch from '@mui/material/Switch'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import FormField from './form-field'

export default function FamiliarFields() {
  const { control, setValue } = useFormContext<WizardFormData>()
  const familiar = useWatch({ control, name: 'familiar' })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 rounded-lg border border-divider bg-surface-container-lowest px-4 py-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-text-secondary">
          <FamilyRestroomRoundedIcon fontSize="small" />
        </span>

        <span className="flex-1 text-body-lg font-medium text-text-primary">
          ¿Es familiar?
        </span>

        <Controller
          name="familiar"
          control={control}
          render={({ field }) => (
            <Switch
              checked={Boolean(field.value)}
              onChange={(_, checked) => {
                field.onChange(checked)
                if (!checked) {
                  setValue('nombre_familiar', '', { shouldValidate: true })
                }
              }}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      <FormField
        name="nombre_familiar"
        label="Nombre de Familiar"
        placeholder="Nombre y apellido del familiar"
        disabled={!familiar}
      />
    </div>
  )
}
