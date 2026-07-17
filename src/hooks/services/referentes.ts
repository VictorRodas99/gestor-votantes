import { useQuery } from '@tanstack/react-query'
import { getReferentes } from '../../services/referentes'

const REFERENTES_STALE_TIME = 1000 * 60 * 5 // 5 min

/** Búsqueda de referentes para el Autocomplete */
export const useReferentesSearch = (search: string) => {
  return useQuery({
    queryKey: ['referentes', 'search', search],
    queryFn: () => getReferentes(search),
    staleTime: REFERENTES_STALE_TIME
  })
}
