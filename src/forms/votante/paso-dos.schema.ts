import { z } from 'zod'

export const pasoDosSchema = z.object({
  // Mismo formato que el `uniqid()` del backend (lib/codigo.ts).
  codigo: z.string().regex(/^[0-9a-f]{13}$/, 'Código inválido'),
  local_votacion_id: z
    .number({ error: 'Seleccione un local de votación' })
    .int()
    .positive(),
  boleta: z.number().int().positive().optional(),
  talon: z.number().int().positive().optional(),
  mesa: z.number().int().positive().optional(),
  orden: z.number().int().positive().optional(),
  hora_votacion: z.iso.time({
    precision: -1,
    error: 'Ingrese la hora de votación'
  }),
  afiliacion: z.boolean(),
  voto_seguro: z.boolean(),
  voto_intendente: z.boolean(),
  voto_intendente_anr: z.boolean(),
  voto_intendente_alianza: z.boolean(),
  voto_concejal: z.boolean(),
  movil: z.boolean(),
  visitado: z.boolean(),
  volver_visitar: z.boolean()
})

export type PasoDosFormData = z.infer<typeof pasoDosSchema>
