import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getVotantes, type VotantesFilters } from '../../services/votantes'

export const BASE_VOTANTE_QUERY = 'votantes'
const VOTANTES_STALE_TIME = 1000 * 30 // 30 secs

export const useVotantes = (filters: VotantesFilters = {}) => {
  return useQuery({
    queryKey: [BASE_VOTANTE_QUERY, filters],
    queryFn: () => getVotantes(filters),
    placeholderData: keepPreviousData,
    staleTime: VOTANTES_STALE_TIME
  })
}
