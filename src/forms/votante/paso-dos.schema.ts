import { z } from 'zod'

export const pasoDosSchema = z.object({
  // `codigo` no está acá a propósito: se deriva de la cédula (lib/codigo.ts),
  // así que no es un dato que el usuario cargue ni que haya que validar.
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
