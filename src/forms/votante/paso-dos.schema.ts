import { z } from 'zod'

export const pasoDosSchema = z.object({
  local_votacion_id: z
    .number({ error: 'Seleccione un local de votación' })
    .int()
    .positive(),
  boleta: z.number({ error: 'La boleta es obligatoria' }).int().positive(),
  talon: z.number({ error: 'El talón es obligatorio' }).int().positive(),
  mesa: z.number().int().positive().optional(),
  orden: z.number().int().positive().optional(),
  afiliacion: z.boolean(),
  voto_seguro: z.boolean(),
  voto_intendente: z.boolean(),
  voto_concejal: z.boolean(),
  movil: z.boolean()
})

export type PasoDosFormData = z.infer<typeof pasoDosSchema>
