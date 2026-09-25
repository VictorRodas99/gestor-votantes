import ShoppingBasketRoundedIcon from '@mui/icons-material/ShoppingBasketRounded'
import Switch from '@mui/material/Switch'
import { Controller, useFormContext } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'

export default function MercaderiaField() {
  const { control, setValue } = useFormContext<WizardFormData>()

  return (
    <div className="flex items-center gap-3 rounded-lg border border-divider bg-surface-container-lowest px-4 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-text-secondary">
        <ShoppingBasketRoundedIcon fontSize="small" />
      </span>

      <span className="flex-1 text-body-lg font-medium text-text-primary">
        Mercadería
      </span>

      <Controller
        name="mercaderia"
        control={control}
        render={({ field }) => (
          <Switch
            checked={Boolean(field.value)}
            onChange={(_, checked) => {
              field.onChange(checked)
              // Excluyente con inc.: al prender uno se apaga el otro.
              if (checked) {
                setValue('inc', false, { shouldValidate: true })
                setValue('valor_inc', undefined, { shouldValidate: true })
              }
            }}
            onBlur={field.onBlur}
          />
        )}
      />
    </div>
  )
}
