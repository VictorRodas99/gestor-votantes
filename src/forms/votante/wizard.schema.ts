import type { z } from 'zod'
import { pasoDosSchema } from './paso-dos.schema'
import { pasoUnoSchema } from './paso-uno.schema'
import { referenteSchema } from './referente.schema'

export const wizardSchema = pasoUnoSchema
  .extend(pasoDosSchema.shape)
  .extend({
    nuevo_referente: referenteSchema.optional()
  })
  .superRefine((data, ctx) => {
    // Al crear un referente nuevo, el barrio compartido es obligatorio.
    if (data.nuevo_referente && !data.barrio_id) {
      ctx.addIssue({
        code: 'custom',
        message: 'Seleccione un barrio para el referente',
        path: ['barrio_id']
      })
    }

    if (!data.referente_id && !data.nuevo_referente) {
      ctx.addIssue({
        code: 'custom',
        message:
          'Debe asignar un referente: elija uno existente o cree uno nuevo',
        path: ['referente_id']
      })
    }
  })

export type WizardFormData = z.infer<typeof wizardSchema>
