// respuesta de endpoint de api `/user`
export type UsuarioSesionRaw = {
  log?: boolean
  id?: string | number
  /** `{ "6": "Punteros" }`; `json_encode` da `[]` si no tiene grupos. */
  grupos?: Record<string, string> | string[]
}

export type UsuarioSesion = {
  id: number
  grupos: number[]
}
