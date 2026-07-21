import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import StepDatosPersonales from '../components/wizard/step-datos-personales'
import StepDatosVisita from '../components/wizard/step-datos-visita'
import StepDatosVotacion from '../components/wizard/step-datos-votacion'
import WizardProgress from '../components/wizard/wizard-progress'
import votanteWizardFormDefaults from '../forms/votante/default-values'
import {
  wizardSchema,
  type WizardFormData
} from '../forms/votante/wizard.schema'
import { useCrearVotante } from '../hooks/services/votantes'
import type { WizardStepProps } from '../types/wizard'

const STEP = Object.freeze({
  datos: 'datos-personales',
  votacion: 'datos-votacion',
  visita: 'visita'
})
type FlowStep = (typeof STEP)[keyof typeof STEP]

const STEP_ORDER = Object.values(STEP) as FlowStep[]

const STEP_TITLE: Record<FlowStep, string> = {
  [STEP.datos]: 'Datos Personales',
  [STEP.votacion]: 'Votación',
  [STEP.visita]: 'Visita'
}

// Labels cortos para el stepper horizontal de desktop.
const STEP_SHORT_LABEL: Record<FlowStep, string> = {
  [STEP.datos]: 'Personales',
  [STEP.votacion]: 'Votación',
  [STEP.visita]: 'Visita'
}

function VotanteWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState<{ previous: FlowStep; current: FlowStep }>({
    previous: STEP.datos,
    current: STEP.datos
  })

  // Modo padrón/alta: dueño del orquestador para compartir el readonly del padrón
  const [origen, setOrigen] = useState<'nuevo' | 'padron'>('nuevo')

  const form = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    mode: 'onChange',
    defaultValues: votanteWizardFormDefaults
  })

  const crearVotante = useCrearVotante()

  const handleNextStep = () => {
    const from = step.current
    const nextIndex = STEP_ORDER.indexOf(from) + 1
    setStep({ previous: from, current: STEP_ORDER[nextIndex] ?? from })
  }

  const handlePrevStep = () => {
    const back = step.previous
    const prevIndex = STEP_ORDER.indexOf(back) - 1
    setStep({ current: back, previous: STEP_ORDER[prevIndex] ?? STEP_ORDER[0] })
  }

  // post último paso
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await toast
        .promise(crearVotante.mutateAsync(data), {
          loading: 'Guardando votante…',
          success: (response) => response.message,
          error: (reason) =>
            reason instanceof Error ? reason.message : 'Error al guardar'
        })
        .unwrap()

      navigate('/votantes')
    } catch {
      // ...
    }
  })

  const currentIndex = STEP_ORDER.indexOf(step.current)
  const isFirst = currentIndex === 0
  const isLast = currentIndex === STEP_ORDER.length - 1

  const stepProps: WizardStepProps = {
    onNext: isLast ? undefined : handleNextStep,
    onPrevious: isFirst ? undefined : handlePrevStep,
    onSubmit: isLast ? handleSubmit : undefined,
    isSubmitting: crearVotante.isPending
  }

  const renderStep = (): ReactNode => {
    switch (step.current) {
      case STEP.datos:
        return (
          <StepDatosPersonales
            {...stepProps}
            origen={origen}
            onOrigenChange={setOrigen}
            onCancel={() => navigate('/votantes')}
          />
        )
      case STEP.votacion:
        return (
          <StepDatosVotacion
            {...stepProps}
            readOnlyPadron={origen === 'padron'}
          />
        )
      case STEP.visita:
        return <StepDatosVisita {...stepProps} />
    }
  }

  return (
    <FormProvider {...form}>
      {/* Tablet: columna acotada y centrada; desktop: ancho completo (2 columnas). */}
      <div className="flex flex-col gap-6 md:mx-auto md:max-w-2xl lg:max-w-none">
        <WizardProgress
          current={currentIndex}
          total={STEP_ORDER.length}
          title={STEP_TITLE[step.current]}
          steps={STEP_ORDER.map((s) => STEP_SHORT_LABEL[s])}
        />
        {renderStep()}
      </div>
    </FormProvider>
  )
}

export default VotanteWizard
