/** Referente tal cual lo devuelve la API (todos los campos string). */
export type ReferenteRaw = {
  id: string
  nombre_apellido: string
  cedula: string
  celular: string
  afiliacion: string
  barrio_id: string
  sector_id: string
  /** Opcional: un deploy viejo del server puede no devolverlo. */
  user_id?: string
}

/** Modelo de dominio de un referente ya casteado. */
export type Referente = {
  id: number
  nombreApellido: string
  cedula: string
  celular: string
  afiliacion: boolean
  barrioId: number
  sectorId: number
  /** Usuario del sistema al que está asociado; `0` si no tiene ninguno. */
  userId: number
}
