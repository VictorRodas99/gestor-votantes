import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import Button from '@mui/material/Button'
import { useFormContext, useWatch, type Path } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import type { Votante } from '../../types/votante'
import type { WizardStepProps } from '../../types/wizard'
import BarrioSelect from './barrio-select'
import CedulaSearch from './cedula-search'
import FormField from './form-field'
import ReferenteField from './referente-field'
import SexoToggle from './sexo-toggle'
import UbicacionField from './ubicacion-field'

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
}

/** Paso 1 · Datos Personales (identidad + campaña + referente). */
export default function StepDatosPersonales({
  onNext,
  origen,
  onOrigenChange
}: StepDatosPersonalesProps) {
  const form = useFormContext<WizardFormData>()

  // orquestador para que el readonly del padrón lo compartan Paso 1 y Paso 2.
  const referenteId = useWatch({ control: form.control, name: 'referente_id' })

  const readOnlyIdentidad = origen === 'padron'

  const prefillDesdePadron = (votante: Votante) => {
    form.setValue('cedula', votante.cedula)
    form.setValue('apellido', votante.apellido)
    form.setValue('nombre', votante.nombre)
    form.setValue('fecha_nacimiento', votante.fechaNacimiento)
    if (votante.sexo === 'M' || votante.sexo === 'F') {
      form.setValue('sexo', votante.sexo)
    }
    if (votante.celular) form.setValue('celular', votante.celular)

    if (votante.localVotacionId) {
      form.setValue('local_votacion_id', votante.localVotacionId)
    }
    if (votante.boleta) form.setValue('boleta', votante.boleta)
    if (votante.talon) form.setValue('talon', votante.talon)
    onOrigenChange('padron')
  }

  const handleNext = async () => {
    const valido = await form.trigger(PASO_UNO_FIELDS)
    if (valido) onNext?.()
  }

  return (
    <div className="flex flex-col gap-5">
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

      <UbicacionField />

      {/* Barrio: bloqueado si hay un referente existente elegido (manda el suyo, §1.4). */}
      <BarrioSelect disabled={referenteId != null} />

      <ReferenteField />

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
  )
}
