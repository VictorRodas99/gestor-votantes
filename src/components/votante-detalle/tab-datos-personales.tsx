import { useFormContext, useWatch } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import BarrioSelect from '../wizard/barrio-select'
import CelularField from '../wizard/celular-field'
import FormField from '../wizard/form-field'
import ReferenteField from '../wizard/referente-field'
import SexoToggle from '../wizard/sexo-toggle'
import UbicacionField from '../wizard/ubicacion-field'
import MapaAcciones from './mapa-acciones'

/**
 * La identidad viene del padrón y queda bloqueada, con las mismas reglas que el
 * wizard en modo padrón. La cédula además es la clave del upsert: cambiarla
 * crearía otro votante en vez de editar este.
 */
export default function TabDatosPersonales() {
  const { control } = useFormContext<WizardFormData>()
  const referenteId = useWatch({ control, name: 'referente_id' })

  return (
    <>
      <FormField name="cedula" label="Cédula" disabled />

      <div className="grid grid-cols-2 gap-3">
        <FormField name="apellido" label="Apellido" disabled />
        <FormField name="nombre" label="Nombre" disabled />
      </div>

      <FormField
        name="fecha_nacimiento"
        label="Nacimiento"
        type="date"
        disabled
      />
      <SexoToggle disabled />
      <FormField name="nacionalidad" label="Nacionalidad" disabled />

      <CelularField />

      <UbicacionField />
      <MapaAcciones />

      {/* Bloqueado con un referente existente: manda el barrio del referente. */}
      <BarrioSelect disabled={referenteId != null} />
      <ReferenteField />
    </>
  )
}
