import { useQuery } from '@tanstack/react-query'
import { getLocalesVotacion } from '../../services/catalogos'

const CATALOGO_STALE_TIME = 1000 * 60 * 60 // 1 hora

export const useLocalesVotacion = () => {
  return useQuery({
    queryKey: ['catalogo', 'local_votacion'],
    queryFn: getLocalesVotacion,
    staleTime: CATALOGO_STALE_TIME
  })
}
