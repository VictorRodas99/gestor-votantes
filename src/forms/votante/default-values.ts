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
  afiliacion: false,
  voto_seguro: false,
  voto_intendente: false,
  voto_concejal: false,
  movil: false,
  visitado: false
} as const

const pasoTresDefaults = {
  encargado_visita: '',
  tipo_visita: '',
  observacion: '',
  familiar: false,
  inc: false,
  valor_inc: undefined
} as const

export default {
  ...pasoUnoDefaults,
  ...pasoDosDefaults,
  ...pasoTresDefaults
}
