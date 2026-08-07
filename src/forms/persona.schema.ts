import { z } from 'zod'
import { celularSchema } from './celular.schema'

export const CEDULA_REGEX = /^\d{5,8}$/

/**
 * Base compartida de una persona cargable
 */
export const personaBaseSchema = z.object({
  nombre_apellido: z.string().trim().min(2, 'Mínimo 2 caracteres').max(255),
  cedula: z
    .string()
    .trim()
    .min(1, 'La cédula es obligatoria')
    .regex(CEDULA_REGEX, 'Cédula inválida'),
  celular: celularSchema,
  afiliacion: z.boolean(),
  sector_id: z.number().int().positive().optional()
})
