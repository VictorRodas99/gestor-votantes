import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import Button from '@mui/material/Button'
import { useFormContext, type Path } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import type { WizardStepProps } from '../../types/wizard'
import CompromisoToggles from './compromiso-toggles'
import FormField from './form-field'
import LocalVotacionSelect from './local-votacion-select'

// Campos que se validan antes de avanzar (validación por paso, arquitectura §4).
const PASO_DOS_FIELDS: Path<WizardFormData>[] = [
  'local_votacion_id',
  'boleta',
  'talon',
  'mesa',
  'orden',
  'afiliacion',
  'voto_seguro',
  'voto_intendente',
  'voto_concejal',
  'movil'
]

type StepDatosVotacionProps = WizardStepProps & {
  /** El votante viene del padrón (enriquecimiento). */
  readOnlyPadron?: boolean
}

export default function StepDatosVotacion({
  readOnlyPadron,
  onNext,
  onPrevious
}: StepDatosVotacionProps) {
  const form = useFormContext<WizardFormData>()

  const handleNext = async () => {
    const valido = await form.trigger(PASO_DOS_FIELDS)
    if (valido) onNext?.()
  }

  return (
    <div className="flex flex-col gap-5">
      <LocalVotacionSelect disabled={readOnlyPadron} />

      <div className="grid grid-cols-2 gap-3">
        <FormField name="boleta" label="Boleta" placeholder="Ej: 145" numeric />
        <FormField name="talon" label="Talón" placeholder="Ej: 20393" numeric />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField name="mesa" label="Mesa" placeholder="N°" numeric />
        <FormField name="orden" label="Orden" placeholder="N°" numeric />
      </div>

      <CompromisoToggles />

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
          onClick={handleNext}
          endIcon={<ArrowForwardRoundedIcon />}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
