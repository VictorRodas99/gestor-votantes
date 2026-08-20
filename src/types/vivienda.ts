export type ViviendaUbicacion = {
  calle: string
  lat: number | null
  lng: number | null
}

export type Vivienda = {
  id: number
  /** URL absoluta de la foto, o '' si no hay. */
  foto: string
  descripcion: string
  ubicacion: ViviendaUbicacion
  /** Puede venir `null`: registros guardados sin sesión (pendientes-server §19.8 C). */
  usuarioId: number | null
  /** `YYYY-MM-DD HH:MM:SS` crudo; se formatea en la card. */
  createdAt: string
}

export type ViviendaRaw = {
  id: string
  foto: string
  descripcion: string
  ubicacion: string
  user_id: string | null
  created_at: string
}
