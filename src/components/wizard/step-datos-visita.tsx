import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import FamilyRestroomRoundedIcon from '@mui/icons-material/FamilyRestroomRounded'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import { Controller, useFormContext } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import type { WizardStepProps } from '../../types/wizard'
import FormField from './form-field'
import IncFields from './inc-fields'

export default function StepDatosVisita({
  onPrevious,
  onSubmit
}: WizardStepProps) {
  const { control } = useFormContext<WizardFormData>()

  return (
    <div className="flex flex-col gap-5">
      <FormField
        name="encargado_visita"
        label="Encargado visita"
        placeholder="Nombre del encargado"
      />

      {/* texto libre hasta que se confirme que se usa un enum definido */}
      <FormField
        name="tipo_visita"
        label="Tipo de visita"
        placeholder="Ej: Presencial"
      />

      <FormField
        name="observacion"
        label="Observación"
        placeholder="Detalles adicionales o notas importantes…"
        multiline
        minRows={4}
      />

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
              onChange={(_, checked) => field.onChange(checked)}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      <IncFields />

      <div className="flex gap-3">
        {onPrevious && (
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={onPrevious}
            startIcon={<ArrowBackRoundedIcon />}
          >
            Anterior
          </Button>
        )}
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={onSubmit}
          startIcon={<CheckCircleRoundedIcon />}
        >
          Guardar
        </Button>
      </div>
    </div>
  )
}
