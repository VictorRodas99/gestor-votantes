// respuesta de endpoint de api `/user`
export type UsuarioSesionRaw = {
  log?: boolean
  id?: string | number
}

export type UsuarioSesion = {
  id: number
}
