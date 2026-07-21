import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import { lazy, Suspense } from 'react'
import { useFormContext, useWatch, type Path } from 'react-hook-form'
import votanteWizardFormDefaults from '../../forms/votante/default-values'
import { votanteAValoresWizard } from '../../forms/votante/prefill'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import type { Votante } from '../../types/votante'
import type { WizardStepProps } from '../../types/wizard'
import BarrioSelect from './barrio-select'
import CedulaSearch from './cedula-search'
import FormField from './form-field'
import ReferenteField from './referente-field'
import SectionTitle from './section-title'
import SexoToggle from './sexo-toggle'
import UbicacionField from './ubicacion-field'

// solo desktop
const MapInline = lazy(() => import('./map-inline'))

// Campos que se validan antes de avanzar (validación por paso, arquitectura §4).
const PASO_UNO_FIELDS: Path<WizardFormData>[] = [
  'cedula',
  'apellido',
  'nombre',
  'fecha_nacimiento',
  'sexo',
  'celular',
  'direccion.calle',
  'direccion.lat',
  'direccion.lng',
  'barrio_id',
  'referente_id',
  'nuevo_referente'
]

type StepDatosPersonalesProps = WizardStepProps & {
  origen: 'nuevo' | 'padron'
  onOrigenChange: (origen: 'nuevo' | 'padron') => void
  onCancel: () => void
}

/** Paso 1 · Datos Personales (identidad + campaña + referente). */
export default function StepDatosPersonales({
  onNext,
  origen,
  onOrigenChange,
  onCancel
}: StepDatosPersonalesProps) {
  const form = useFormContext<WizardFormData>()

  // orquestador para que el readonly del padrón lo compartan Paso 1 y Paso 2.
  const referenteId = useWatch({ control: form.control, name: 'referente_id' })
  const esDesktop = useMediaQuery('(min-width:1024px)')

  const readOnlyIdentidad = origen === 'padron'

  const prefillDesdePadron = (votante: Votante) => {
    form.reset({
      ...votanteWizardFormDefaults,
      ...votanteAValoresWizard(votante)
    })
    onOrigenChange('padron')
  }

  const handleNext = async () => {
    const valido = await form.trigger(PASO_UNO_FIELDS)
    if (valido) onNext?.()
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-12 lg:gap-8 lg:rounded-xl lg:border lg:border-divider lg:bg-surface-container-lowest lg:p-6">
        {/* Columna izquierda · formulario */}
        <div className="flex flex-col gap-5 lg:col-span-7">
          <SectionTitle>Datos Personales</SectionTitle>

          <CedulaSearch
            origen={origen}
            onPrefill={prefillDesdePadron}
            onReset={() => onOrigenChange('nuevo')}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              name="apellido"
              label="Apellido"
              placeholder="Ingrese apellido"
              disabled={readOnlyIdentidad}
            />
            <FormField
              name="nombre"
              label="Nombre"
              placeholder="Ingrese nombre"
              disabled={readOnlyIdentidad}
            />
          </div>

          <FormField
            name="fecha_nacimiento"
            label="Nacimiento"
            type="date"
            disabled={readOnlyIdentidad}
          />

          <SexoToggle disabled={readOnlyIdentidad} />

          <FormField
            name="celular"
            label="Celular"
            placeholder="Ej: 0991123456"
            type="tel"
          />

          <SectionTitle>Ubicación y Referencias</SectionTitle>

          <UbicacionField />

          {/* Barrio: bloqueado si hay un referente existente elegido (manda el suyo, §1.4). */}
          <BarrioSelect disabled={referenteId != null} />

          <ReferenteField />
        </div>

        {/* Columna derecha · mapa persistente (solo desktop) */}
        <aside className="hidden lg:col-span-5 lg:block">
          <div className="lg:sticky lg:top-24">
            {esDesktop && (
              <Suspense fallback={null}>
                <MapInline />
              </Suspense>
            )}
          </div>
        </aside>
      </div>

      {/* Botonera al pie */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:border-t lg:border-divider lg:pt-5">
        <Button
          variant="text"
          size="large"
          onClick={onCancel}
          className="hidden lg:inline-flex"
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleNext}
          endIcon={<ArrowForwardRoundedIcon />}
          className="lg:w-auto lg:min-w-40 lg:flex-none"
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
