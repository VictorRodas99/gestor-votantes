import { z } from 'zod'

export const pasoTresSchema = z.object({
  encargado_visita: z.string().trim().max(100).optional(),
  tipo_visita: z.string().trim().max(100).optional(),
  // Opcional aunque `familiar` esté en true: el switch habilita, no exige.
  nombre_familiar: z.string().trim().max(255).optional(),
  // El <input type="date"> ya entrega `YYYY-MM-DD`; `''` = sin cargar.
  // Admite fechas futuras: sirve para agendar la visita, no solo para registrarla.
  fecha_visita: z.iso.date('Fecha inválida').optional().or(z.literal('')),
  observacion: z.string().trim().max(255).optional(),
  familiar: z.boolean(),
  inc: z.boolean(),
  valor_inc: z.number().int().positive().optional()
})

export type PasoTresFormData = z.infer<typeof pasoTresSchema>
