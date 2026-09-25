import { z } from 'zod'

/**
 * Campos del día de la elección. No son un paso del wizard: se editan en el
 * detalle del votante, pero viajan en el mismo POST.
 */
export const jornadaSchema = z.object({
  yavoto: z.boolean(),
  cobro: z.boolean(),
  obs: z.string().trim().max(255).optional()
})

export type JornadaFormData = z.infer<typeof jornadaSchema>
