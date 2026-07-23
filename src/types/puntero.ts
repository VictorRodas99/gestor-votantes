export type PunteroRaw = {
  id: string
  nombre_apellido: string
  cedula: string
  celular: string
  afiliacion: string
  barrio_id: string
  sector_id: string
  /** Única columna nullable (varchar(100) NULL en DB). */
  transporte: string | null
}

/** Modelo de dominio de un puntero ya casteado. */
export type Puntero = {
  id: number
  nombreApellido: string
  cedula: string
  celular: string
  afiliacion: boolean
  barrioId: number
  sectorId: number
  transporte: string | null
}
