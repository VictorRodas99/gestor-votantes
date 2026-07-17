import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import Button from '@mui/material/Button'
import type { WizardStepProps } from '../../types/wizard'

type StepPlaceholderProps = WizardStepProps & {
  title: string
  description: string
}

/**
 * Placeholder de los pasos aún no implementados (Votación, Visita). Mantiene la
 * navegación del wizard funcionando hasta que se planifiquen en detalle.
 */
export default function StepPlaceholder({
  title,
  description,
  onNext,
  onPrevious,
  onSubmit
}: StepPlaceholderProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-md border border-dashed border-divider bg-surface-container-low p-6 text-center">
        <h2 className="text-headline-md font-semibold text-text-primary">
          {title}
        </h2>
        <p className="mt-1 text-body-md text-text-secondary">{description}</p>
        <p className="mt-4 text-label-sm text-text-secondary">
          Paso en construcción.
        </p>
      </div>

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
        {onSubmit ? (
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={onSubmit}
            startIcon={<CheckCircleRoundedIcon />}
          >
            Guardar
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={onNext}
            endIcon={<ArrowForwardRoundedIcon />}
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  )
}
