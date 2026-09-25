import type { FieldErrors } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'

export const TAB = Object.freeze({ personales: 0, votacion: 1, visita: 2 })
export type TabDetalle = (typeof TAB)[keyof typeof TAB]

// `Record` sobre todas las claves: un campo nuevo en el schema no compila hasta
// que se le asigne tab, así ningún error queda en una tab que nadie abre.
const TAB_POR_CAMPO: Record<keyof WizardFormData, TabDetalle> = {
  cedula: TAB.personales,
  apellido: TAB.personales,
  nombre: TAB.personales,
  fecha_nacimiento: TAB.personales,
  sexo: TAB.personales,
  nacionalidad: TAB.personales,
  celular: TAB.personales,
  direccion: TAB.personales,
  barrio_id: TAB.personales,
  referente_id: TAB.personales,
  nuevo_referente: TAB.personales,

  yavoto: TAB.votacion,
  cobro: TAB.votacion,
  obs: TAB.votacion,
  local_votacion_id: TAB.votacion,
  boleta: TAB.votacion,
  talon: TAB.votacion,
  mesa: TAB.votacion,
  orden: TAB.votacion,
  hora_votacion: TAB.votacion,
  afiliacion: TAB.votacion,
  voto_seguro: TAB.votacion,
  voto_intendente: TAB.votacion,
  voto_intendente_anr: TAB.votacion,
  voto_intendente_alianza: TAB.votacion,
  voto_concejal: TAB.votacion,
  movil: TAB.votacion,
  contactado: TAB.votacion,
  visitado: TAB.votacion,
  volver_visitar: TAB.votacion,

  encargado_visita: TAB.visita,
  tipo_visita: TAB.visita,
  nombre_familiar: TAB.visita,
  fecha_visita: TAB.visita,
  observacion: TAB.visita,
  familiar: TAB.visita,
  mercaderia: TAB.visita,
  inc: TAB.visita,
  valor_inc: TAB.visita
}

const camposConError = (errores: FieldErrors<WizardFormData>) =>
  (Object.keys(errores) as (keyof WizardFormData)[])
    .filter((campo) => campo in TAB_POR_CAMPO)
    .sort((a, b) => TAB_POR_CAMPO[a] - TAB_POR_CAMPO[b])

export function tabsConError(
  errores: FieldErrors<WizardFormData>
): Set<TabDetalle> {
  return new Set(camposConError(errores).map((campo) => TAB_POR_CAMPO[campo]))
}

/** Tab y mensaje del primer error, en el orden visual de las tabs. */
export function primerError(errores: FieldErrors<WizardFormData>) {
  const [campo] = camposConError(errores)
  if (!campo) return null

  const mensaje = errores[campo]?.message
  return {
    tab: TAB_POR_CAMPO[campo],
    mensaje: typeof mensaje === 'string' ? mensaje : null
  }
}
