import { useQuery } from '@tanstack/react-query'
import { getUsuarioActual } from '../../services/sesion'

/**
 * Usuario logueado en el sistema heredado
 */
export const useUsuarioActual = () => {
  return useQuery({
    queryKey: ['sesion', 'usuario'],
    queryFn: getUsuarioActual,
    // La sesión no cambia mientras el SPA está montado.
    staleTime: Infinity,
    retry: false
  })
}
