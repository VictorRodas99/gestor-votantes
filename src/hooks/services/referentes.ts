import { useQuery } from '@tanstack/react-query'
import { getReferentePorId, getReferentes } from '../../services/referentes'

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
