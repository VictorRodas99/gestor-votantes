import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState, type ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import StepDatosPersonales from '../components/wizard/step-datos-personales'
import StepPlaceholder from '../components/wizard/step-placeholder'
import WizardProgress from '../components/wizard/wizard-progress'
import {
  wizardSchema,
  type WizardFormData
} from '../forms/votante/wizard.schema'
import { calcularEdad } from '../lib/date'
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

const stepComponents: Record<FlowStep, (props: WizardStepProps) => ReactNode> =
  {
    [STEP.datos]: (props) => <StepDatosPersonales {...props} />,
    [STEP.votacion]: (props) => (
      <StepPlaceholder
        title="Datos de Votación"
        description="Local, boleta, talón, mesa y estado de compromiso."
        {...props}
      />
    ),
    [STEP.visita]: (props) => (
      <StepPlaceholder
        title="Visita"
        description="Encargado, tipo de visita y observación."
        {...props}
      />
    )
  }

function VotanteWizard() {
  const [step, setStep] = useState<{ previous: FlowStep; current: FlowStep }>({
    previous: STEP.datos,
    current: STEP.datos
  })

  const form = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    mode: 'onChange',
    defaultValues: {
      cedula: '',
      apellido: '',
      nombre: '',
      fecha_nacimiento: '',
      sexo: 'M',
      celular: '',
      direccion: { calle: '', lat: undefined, lng: undefined },
      barrio_id: undefined,
      referente_id: undefined,
      nuevo_referente: undefined
    }
  })

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
  const handleSubmit = form.handleSubmit((data) => {
    console.log('[wizard votante] body a enviar:', {
      cedula: data.cedula,
      apellido: data.apellido,
      nombre: data.nombre,
      fecha_nacimiento: data.fecha_nacimiento,
      edad: calcularEdad(data.fecha_nacimiento),
      sexo: data.sexo,
      celular: data.celular ?? '',
      // `direccion` como objeto: el backend lo reparte a las columnas `direccion`
      // (calle) y `mapa` ("lat,lng").
      direccion: {
        calle: data.direccion?.calle ?? '',
        lat: data.direccion?.lat ?? null,
        lng: data.direccion?.lng ?? null
      },
      barrio_id: data.barrio_id ?? 0,
      referente_id: data.referente_id ?? 0,
      nuevo_referente: data.nuevo_referente
        ? { ...data.nuevo_referente, barrio_id: data.barrio_id ?? 0 }
        : null
    })
    toast.warning('Falta POST: el body se muestra en la consola.')
  })

  const currentIndex = STEP_ORDER.indexOf(step.current)
  const isFirst = currentIndex === 0
  const isLast = currentIndex === STEP_ORDER.length - 1

  const CurrentStep = useMemo(() => stepComponents[step.current], [step])

  const stepProps: WizardStepProps = {
    onNext: isLast ? undefined : handleNextStep,
    onPrevious: isFirst ? undefined : handlePrevStep,
    onSubmit: isLast ? handleSubmit : undefined
  }

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-6">
        <WizardProgress
          current={currentIndex}
          total={STEP_ORDER.length}
          title={STEP_TITLE[step.current]}
        />
        {CurrentStep(stepProps)}
      </div>
    </FormProvider>
  )
}

export default VotanteWizard
