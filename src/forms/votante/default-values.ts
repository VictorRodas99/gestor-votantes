const pasoUnoDefaults = {
  cedula: '',
  apellido: '',
  nombre: '',
  fecha_nacimiento: '',
  sexo: 'M',
  nacionalidad: '',
  celular: '',
  direccion: { calle: '', lat: undefined, lng: undefined },
  barrio_id: undefined,
  referente_id: undefined,
  nuevo_referente: undefined
} as const

const pasoDosDefaults = {
  local_votacion_id: undefined,
  boleta: undefined,
  talon: undefined,
  mesa: undefined,
  orden: undefined,
  hora_votacion: '',
  afiliacion: false,
  voto_seguro: false,
  voto_intendente: false,
  voto_intendente_anr: false,
  voto_intendente_alianza: false,
  voto_concejal: false,
  movil: false,
  contactado: false,
  visitado: false,
  volver_visitar: false
} as const

const pasoTresDefaults = {
  encargado_visita: '',
  tipo_visita: '',
  nombre_familiar: '',
  fecha_visita: '',
  observacion: '',
  familiar: false,
  inc: false,
  valor_inc: undefined
} as const

/**
 * Es una **factory** y no un objeto literal para que cada `reset` parta de un
 * objeto propio y no comparta el `direccion` anidado entre altas.
 */
export default function crearValoresPorDefecto() {
  return {
    ...pasoUnoDefaults,
    ...pasoDosDefaults,
    ...pasoTresDefaults,
    direccion: { ...pasoUnoDefaults.direccion }
  }
}
