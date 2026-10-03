import { GRUPO_PUNTEROS } from '../constants/config'
import { useUsuarioActual } from './services/sesion'

export function usePuedeEditarJornada() {
  const { data: usuario } = useUsuarioActual()
  return !!usuario && !usuario.grupos.includes(GRUPO_PUNTEROS)
}
