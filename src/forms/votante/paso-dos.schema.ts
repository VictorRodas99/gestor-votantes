import { z } from 'zod'

export const pasoDosSchema = z.object({
  local_votacion_id: z
    .number({ error: 'Seleccione un local de votación' })
    .int()
    .positive(),
  boleta: z.number().int().positive().optional(),
  talon: z.number().int().positive().optional(),
  mesa: z.number().int().positive().optional(),
  orden: z.number().int().positive().optional(),
  afiliacion: z.boolean(),
  voto_seguro: z.boolean(),
  voto_intendente: z.boolean(),
  voto_concejal: z.boolean(),
  movil: z.boolean(),
  visitado: z.boolean()
})

export type PasoDosFormData = z.infer<typeof pasoDosSchema>
