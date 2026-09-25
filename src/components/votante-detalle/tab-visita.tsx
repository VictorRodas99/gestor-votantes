import FamiliarFields from '../wizard/familiar-fields'
import FormField from '../wizard/form-field'
import IncFields from '../wizard/inc-fields'
import MercaderiaField from '../wizard/mercaderia-field'

export default function TabVisita() {
  return (
    <>
      <FormField name="fecha_visita" label="Fecha de visita" type="date" />
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
        minRows={3}
      />

      <FamiliarFields />
      <MercaderiaField />
      <IncFields />
    </>
  )
}
