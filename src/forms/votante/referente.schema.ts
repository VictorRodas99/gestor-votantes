import { z } from 'zod'

/** Celular paraguayo: `09` + 8 dígitos. */
const CELULAR_REGEX = /^09\d{8}$/
const CEDULA_REGEX = /^\d{5,8}$/

export const referenteSchema = z.object({
  nombre_apellido: z.string().trim().min(2, 'Mínimo 2 caracteres').max(255),
  cedula: z
    .string()
    .trim()
    .min(1, 'La cédula es obligatoria')
    .regex(CEDULA_REGEX, 'Cédula inválida'),
  celular: z
    .string()
    .trim()
    .min(1, 'El celular es obligatorio')
    .regex(CELULAR_REGEX, 'Formato: 09XXXXXXXX'),
  afiliacion: z.boolean(),
  sector_id: z.number().int().positive().optional()
})

export type ReferenteFormData = z.infer<typeof referenteSchema>
