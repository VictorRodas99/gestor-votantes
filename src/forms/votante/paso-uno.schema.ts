import { z } from 'zod'
import { calcularEdad, esFechaValida } from '../../lib/date'

const CEDULA_REGEX = /^\d+$/
const CELULAR_REGEX = /^09\d{8}$/
const EDAD_MINIMA = 18

export const pasoUnoSchema = z.object({
  cedula: z
    .string()
    .trim()
    .regex(CEDULA_REGEX, 'Solo números')
    .min(5, 'Cédula demasiado corta')
    .max(8, 'Cédula demasiado larga'),
  apellido: z.string().trim().min(2, 'Mínimo 2 caracteres').max(255),
  nombre: z.string().trim().min(2, 'Mínimo 2 caracteres').max(255),
  // `<input type="date">` ya entrega `YYYY-MM-DD`: no hace falta transformar.
  fecha_nacimiento: z
    .string()
    .min(1, 'Requerida')
    .refine(esFechaValida, 'Fecha inválida')
    .refine((iso) => new Date(iso) <= new Date(), 'No puede ser futura')
    .refine(
      (iso) => calcularEdad(iso) >= EDAD_MINIMA,
      `Debe ser mayor de ${EDAD_MINIMA} años`
    ),
  sexo: z.enum(['M', 'F'], { error: 'Seleccione el sexo' }),

  celular: z
    .string()
    .trim()
    .regex(CELULAR_REGEX, 'Formato: 09XXXXXXXX')
    .optional()
    .or(z.literal('')),
  // Ubicación como objeto: calle → columna `direccion`; lat/lng → columna `mapa`.
  direccion: z.object({
    calle: z.string().trim().min(1, 'La dirección es obligatoria').max(255),
    // lat: z.number().optional(),
    // lng: z.number().optional()
    lat: z.number({ error: 'Capture la ubicación por GPS o en el mapa' }),
    lng: z.number({ error: 'Capture la ubicación por GPS o en el mapa' })
  }),
  barrio_id: z.number().int().positive().optional(),
  // Referente existente elegido (0/undefined = sin referente).
  referente_id: z.number().int().positive().optional()
})

export type PasoUnoFormData = z.infer<typeof pasoUnoSchema>
