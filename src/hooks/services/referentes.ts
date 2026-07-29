import { useQuery } from '@tanstack/react-query'
import {
  getReferentePorId,
  getReferentePorUserId,
  getReferentes
} from '../../services/referentes'

const REFERENTES_STALE_TIME = 1000 * 60 * 5 // 5 min

/** Búsqueda de referentes para el Autocomplete */
export const useReferentesSearch = (search: string) => {
  return useQuery({
    queryKey: ['referentes', 'search', search],
    queryFn: () => getReferentes(search),
    staleTime: REFERENTES_STALE_TIME
  })
}

/** Detalle de un referente puntual; deshabilitado si no hay `id`. */
export const useReferentePorId = (id?: number) => {
  return useQuery({
    queryKey: ['referentes', 'detalle', id],
    queryFn: () => getReferentePorId(id as number),
    enabled: id != null,
    staleTime: REFERENTES_STALE_TIME
  })
}

/**
 * Referente del usuario logueado. Deshabilitado si no hay `userId` o es `0`: el
 * server ignora el filtro con `0` y devolvería el primer referente de la tabla.
 */
export const useReferentePorUserId = (userId?: number) => {
  return useQuery({
    queryKey: ['referentes', 'por-usuario', userId],
    queryFn: () => getReferentePorUserId(userId as number),
    enabled: userId != null && userId > 0,
    staleTime: REFERENTES_STALE_TIME
  })
}
