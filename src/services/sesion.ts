import { SESION_ROUTES } from '../constants/routes'
import api from '../lib/http'
import type { UsuarioSesion, UsuarioSesionRaw } from '../types/sesion'

export const getUsuarioActual = async (): Promise<UsuarioSesion | null> => {
  try {
    const raw = await api.get(SESION_ROUTES.user).json<UsuarioSesionRaw>()

    if (raw?.log !== true) return null

    const id = Number(raw.id)
    return Number.isFinite(id) && id > 0 ? { id } : null
  } catch {
    return null
  }
}
