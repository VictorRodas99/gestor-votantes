import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  crearPuntero,
  getPunteroPorId,
  getPunteros,
  type PunterosFilters
} from '../../services/punteros'

export const BASE_PUNTERO_QUERY = 'punteros'
const PUNTEROS_STALE_TIME = 1000 * 60 * 5 // 5 min

export const usePunterosSearch = (
  search: string,
  filtros?: PunterosFilters
) => {
  return useQuery({
    queryKey: [BASE_PUNTERO_QUERY, 'search', search, filtros ?? {}],
    queryFn: () => getPunteros(search, filtros),
    staleTime: PUNTEROS_STALE_TIME
  })
}

export const usePunteroPorId = (id?: number) => {
  return useQuery({
    queryKey: [BASE_PUNTERO_QUERY, 'detalle', id],
    queryFn: () => getPunteroPorId(id as number),
    enabled: id != null,
    staleTime: PUNTEROS_STALE_TIME
  })
}

export const useCrearPuntero = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: crearPuntero,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [BASE_PUNTERO_QUERY] })
  })
}
