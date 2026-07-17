import RedeemRoundedIcon from '@mui/icons-material/RedeemRounded'
import Switch from '@mui/material/Switch'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import FormField from './form-field'

export default function IncFields() {
  const { control, setValue } = useFormContext<WizardFormData>()
  const inc = useWatch({ control, name: 'inc' })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 rounded-lg border border-divider bg-surface-container-lowest px-4 py-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-text-secondary">
          <RedeemRoundedIcon fontSize="small" />
        </span>

        <span className="flex-1 text-body-lg font-medium text-text-primary">
          Inc.
        </span>

        <Controller
          name="inc"
          control={control}
          render={({ field }) => (
            <Switch
              checked={Boolean(field.value)}
              onChange={(_, checked) => {
                field.onChange(checked)
                if (!checked) {
                  setValue('valor_inc', undefined, { shouldValidate: true })
                }
              }}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      <FormField
        name="valor_inc"
        label="Monto de inc."
        placeholder="Ej: 50000"
        numeric
        disabled={!inc}
      />
    </div>
  )
}
