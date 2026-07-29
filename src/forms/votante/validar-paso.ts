import type { Path, UseFormReturn } from 'react-hook-form'
import type { ZodType } from 'zod'
import type { WizardFormData } from './wizard.schema'

/**
 * Valida un paso contra **su propio** schema antes de avanzar.
 *
 * No alcanza con `form.trigger(campos)`: las reglas entre-campos viven en un
 * `superRefine` a nivel de objeto y Zod lo saltea si algún campo del schema
 * falla.
 */
export async function validarPaso(
  form: UseFormReturn<WizardFormData>,
  schema: ZodType,
  campos: Path<WizardFormData>[]
): Promise<boolean> {
  await form.trigger(campos)

  const resultado = schema.safeParse(form.getValues())
  if (resultado.success) return true

  for (const issue of resultado.error.issues) {
    form.setError(issue.path.join('.') as Path<WizardFormData>, {
      type: 'custom',
      message: issue.message
    })
  }

  return false
}
