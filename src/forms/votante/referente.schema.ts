import type { z } from 'zod'
import { personaBaseSchema } from '../persona.schema'

export const referenteSchema = personaBaseSchema

export type ReferenteFormData = z.infer<typeof referenteSchema>
