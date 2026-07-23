import { z } from 'zod'
import { personaBaseSchema } from '../persona.schema'

export const punteroSchema = personaBaseSchema.extend({
  barrio_id: z.number().int().positive().optional(),
  transporte: z.string().trim().max(100).optional()
})

export type PunteroFormData = z.infer<typeof punteroSchema>
