import type { DefaultValues } from 'react-hook-form'
import type { WizardFormData } from './wizard.schema'

// Solo objetos planos (`direccion`, `nuevo_referente`) y primitivos.
const sonIguales = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b)

/**
 * `POST /votaciones` guarda el registro completo: si el detalle estuvo abierto
 * un rato, mandar lo que se cargó al abrirlo pisaría lo que otro operador
 * guardó mientras tanto (p. ej. el "ya votó"). Por eso se parte del registro
 * **recién traído** y se le aplican solo los campos que difieren de los valores
 * con los que se abrió el form.
 *
 * Se compara contra los valores iniciales y no contra `dirtyFields` porque
 * varios campos cambian de rebote vía `setValue` sin `shouldDirty` (p. ej.
 * prender Mercadería apaga Inc.) y quedarían afuera.
 */
export function aplicarCamposModificados(
  editado: WizardFormData,
  inicial: DefaultValues<WizardFormData>,
  fresco: DefaultValues<WizardFormData>
): WizardFormData {
  const resultado = { ...editado }

  for (const clave of Object.keys(editado) as (keyof WizardFormData)[]) {
    if (clave in fresco && sonIguales(editado[clave], inicial[clave])) {
      Object.assign(resultado, { [clave]: fresco[clave] })
    }
  }

  return resultado
}
