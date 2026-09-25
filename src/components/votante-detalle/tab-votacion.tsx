import { useFormContext, useWatch } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import CodigoField from '../wizard/codigo-field'
import CompromisoToggles from '../wizard/compromiso-toggles'
import FormField from '../wizard/form-field'
import LocalVotacionSelect from '../wizard/local-votacion-select'
import JornadaFields from './jornada-fields'

export default function TabVotacion() {
  const { control } = useFormContext<WizardFormData>()
  const yavoto = useWatch({ control, name: 'yavoto' })

  return (
    <>
      <JornadaFields />

      <hr className="border-divider" />

      {/* De solo lectura (derivado de la cédula) y solo una vez que votó. */}
      {yavoto && <CodigoField />}

      <LocalVotacionSelect disabled />

      <div className="grid grid-cols-2 gap-3">
        <FormField name="boleta" label="Boleta" placeholder="Ej: 145" numeric />
        <FormField name="talon" label="Talón" placeholder="Ej: 20393" numeric />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField name="mesa" label="Mesa" placeholder="N°" numeric />
        <FormField name="orden" label="Orden" placeholder="N°" numeric />
      </div>

      <FormField name="hora_votacion" label="Hora de votación" type="time" />

      <CompromisoToggles />
    </>
  )
}
