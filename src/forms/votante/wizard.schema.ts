import type { z } from 'zod'
import { pasoDosSchema } from './paso-dos.schema'
import { pasoTresSchema } from './paso-tres.schema'
import { pasoUnoSchema } from './paso-uno.schema'
import { referenteSchema } from './referente.schema'

/**
 * Viven en una función aparte porque hacen falta en dos lugares: el schema
 * completo (submit final) y el schema del paso (validación al avanzar)
 */
function reglasReferente(
  data: {
    barrio_id?: number
    referente_id?: number
    nuevo_referente?: unknown
  },
  ctx: z.RefinementCtx
) {
  // Al crear un referente nuevo, el barrio compartido es obligatorio.
  if (data.nuevo_referente && !data.barrio_id) {
    ctx.addIssue({
      code: 'custom',
      message: 'Seleccione un barrio para el referente',
      path: ['barrio_id']
    })
  }

  if (!data.referente_id && !data.nuevo_referente) {
    ctx.addIssue({
      code: 'custom',
      message:
        'Debe asignar un referente: elija uno existente o cree uno nuevo',
      path: ['referente_id']
    })
  }
}

function reglasIntendente(
  data: { voto_intendente_anr: boolean; voto_intendente_alianza: boolean },
  ctx: z.RefinementCtx
) {
  if (data.voto_intendente_anr && data.voto_intendente_alianza) {
    ctx.addIssue({
      code: 'custom',
      message: 'Elija ANR o Alianza, no ambas',
      path: ['voto_intendente_anr']
    })
  }
}

function reglasInc(
  data: { inc: boolean; valor_inc?: number },
  ctx: z.RefinementCtx
) {
  if (data.inc && !data.valor_inc) {
    ctx.addIssue({
      code: 'custom',
      message: 'Ingrese el monto',
      path: ['valor_inc']
    })
  }
}

// Schemas por paso: incluyen sus propias reglas entre-campos, así se pueden
// validar de a uno al avanzar sin que los campos de los otros pasos (todavía
// vacíos) corten la ejecución del refinamiento.
export const pasoUnoCompletoSchema = pasoUnoSchema
  .extend({ nuevo_referente: referenteSchema.optional() })
  .superRefine(reglasReferente)

export const pasoDosCompletoSchema = pasoDosSchema.superRefine(reglasIntendente)

export const wizardSchema = pasoUnoSchema
  .extend(pasoDosSchema.shape)
  .extend(pasoTresSchema.shape)
  .extend({
    nuevo_referente: referenteSchema.optional()
  })
  .superRefine((data, ctx) => {
    reglasReferente(data, ctx)
    reglasIntendente(data, ctx)
    reglasInc(data, ctx)
  })

export type WizardFormData = z.infer<typeof wizardSchema>
