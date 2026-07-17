import { z } from 'zod'

export const pasoTresSchema = z.object({
  encargado_visita: z.string().trim().max(100).optional(),
  tipo_visita: z.string().trim().max(100).optional(),
  observacion: z.string().trim().max(255).optional(),
  familiar: z.boolean(),
  inc: z.boolean(),
  valor_inc: z.number().int().positive().optional()
})

export type PasoTresFormData = z.infer<typeof pasoTresSchema>
