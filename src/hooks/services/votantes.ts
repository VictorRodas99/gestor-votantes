import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery
} from '@tanstack/react-query'
import { getVotantes, type VotantesFilters } from '../../services/votantes'

export const BASE_VOTANTE_QUERY = 'votantes'
const VOTANTES_STALE_TIME = 1000 * 30 // 30 secs

/** Cédula válida para disparar la búsqueda de prefill (5–8 dígitos). */
const CEDULA_BUSCABLE = /^\d{5,8}$/

/**
 * Busca un votante existente por cédula (match exacto server-side) para el
 * prefill del wizard. Solo consulta con una cédula de 5–8 dígitos.
 */
export const useVotantePorCedula = (cedula: string) => {
  return useQuery({
    queryKey: [BASE_VOTANTE_QUERY, 'por-cedula', cedula],
    queryFn: () => getVotantes({ cedula }),
    enabled: CEDULA_BUSCABLE.test(cedula),
    staleTime: VOTANTES_STALE_TIME
  })
}

export const useVotantesPaged = (
  filters: VotantesFilters = {},
  page: number
) => {
  return useQuery({
    queryKey: [BASE_VOTANTE_QUERY, 'paged', filters, page],
    queryFn: () => getVotantes({ ...filters, page }),
    placeholderData: keepPreviousData,
    staleTime: VOTANTES_STALE_TIME
  })
}

export const useVotantesInfinite = (filters: VotantesFilters = {}) => {
  return useInfiniteQuery({
    queryKey: [BASE_VOTANTE_QUERY, 'infinite', filters],
    queryFn: ({ pageParam }) => getVotantes({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (count, group) => count + group.votantes.length,
        0
      )
      return loaded < lastPage.total ? lastPage.page + 1 : undefined
    },
    staleTime: VOTANTES_STALE_TIME
    // refetchOnMount: false
  })
}
