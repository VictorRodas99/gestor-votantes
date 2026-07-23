export const VOTANTE_ROUTES = {
  index: 'votantes',
  post: 'votaciones'
} as const

export const CATALOGO_ROUTES = {
  localVotacion: 'local_votacion',
  barrios: 'barrios',
  sectores: 'sectores'
} as const

export const REFERENTE_ROUTES = {
  index: 'referentes'
} as const

export const PUNTERO_ROUTES = {
  index: 'punteros',
  post: 'punteros'
} as const

export const ASIGNACION_PUNTERO_ROUTES = {
  index: 'votantes_punteros',
  post: 'votantes_punteros',
  delete: 'votantes_punteros_eliminar'
} as const
