import { z } from 'zod'

export const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp'] as const
export const MAX_FOTO_BYTES = 5 * 1024 * 1024 // 5 MB

export const viviendaSchema = z.object({
  foto: z
    .instanceof(File)
    .refine(
      (file) =>
        TIPOS_IMAGEN.includes(file.type as (typeof TIPOS_IMAGEN)[number]),
      'Formato no permitido'
    )
    .refine((file) => file.size <= MAX_FOTO_BYTES, 'La imagen supera los 5 MB')
    .optional(),
  descripcion: z.string().trim().max(255, 'Máximo 255 caracteres').optional(),
  ubicacion: z.object({
    calle: z.string().trim().max(255).optional(),
    lat: z.number({ error: 'Marcá la ubicación en el mapa' }),
    lng: z.number({ error: 'Marcá la ubicación en el mapa' })
  })
})

export type ViviendaFormData = z.infer<typeof viviendaSchema>
