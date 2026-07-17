import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
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

function VotanteWizard() {
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
      // Paso 2 · Datos de votación (numéricos; booleanos nativos, confirmado §0).
      local_votacion_id: data.local_votacion_id,
      boleta: data.boleta,
      talon: data.talon,
      mesa: data.mesa ?? null,
      orden: data.orden ?? null,
      afiliacion: data.afiliacion,
      voto_seguro: data.voto_seguro,
      voto_intendente: data.voto_intendente,
      voto_concejal: data.voto_concejal,
      movil: data.movil,

      // paso 3
      encargado_visita: data.encargado_visita || null,
      tipo_visita: data.tipo_visita || null,
      observacion: data.observacion ?? '',
      familiar: data.familiar,
      inc: data.inc,
      valor_inc: data.inc ? data.valor_inc : 0,
      nuevo_referente: data.nuevo_referente
        ? { ...data.nuevo_referente, barrio_id: data.barrio_id ?? 0 }
        : null
    })
    toast.warning('Falta POST: el body se muestra en la consola.')
  })

  const currentIndex = STEP_ORDER.indexOf(step.current)
  const isFirst = currentIndex === 0
  const isLast = currentIndex === STEP_ORDER.length - 1

  const stepProps: WizardStepProps = {
    onNext: isLast ? undefined : handleNextStep,
    onPrevious: isFirst ? undefined : handlePrevStep,
    onSubmit: isLast ? handleSubmit : undefined
  }

  const renderStep = (): ReactNode => {
    switch (step.current) {
      case STEP.datos:
        return (
          <StepDatosPersonales
            {...stepProps}
            origen={origen}
            onOrigenChange={setOrigen}
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
      <div className="flex flex-col gap-6">
        <WizardProgress
          current={currentIndex}
          total={STEP_ORDER.length}
          title={STEP_TITLE[step.current]}
        />
        {renderStep()}
      </div>
    </FormProvider>
  )
}

export default VotanteWizard
