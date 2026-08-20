import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { VIVIENDAS_PER_PAGE } from '../../constants/config'
import {
  crearVivienda,
  getViviendas,
  type ViviendasFilters
} from '../../services/viviendas'

export const BASE_VIVIENDA_QUERY = 'viviendas'
const VIVIENDAS_STALE_TIME = 1000 * 30 // 30 s

/**
 * `enabled` deja que la página se suscriba solo a la query del breakpoint montado
 * (paged en desktop, infinite en mobile) sin disparar la otra.
 */
export const useViviendasPaged = (
  filters: ViviendasFilters = {},
  page: number,
  { enabled = true }: { enabled?: boolean } = {}
) =>
  useQuery({
    queryKey: [BASE_VIVIENDA_QUERY, 'paged', filters, page],
    queryFn: () => getViviendas({ ...filters, page }),
    placeholderData: keepPreviousData,
    staleTime: VIVIENDAS_STALE_TIME,
    enabled
  })

export const useViviendasInfinite = (
  filters: ViviendasFilters = {},
  { enabled = true }: { enabled?: boolean } = {}
) =>
  useInfiniteQuery({
    enabled,
    queryKey: [BASE_VIVIENDA_QUERY, 'infinite', filters],
    queryFn: ({ pageParam }) => getViviendas({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.viviendas.length === VIVIENDAS_PER_PAGE
        ? lastPage.page + 1
        : undefined,
    staleTime: VIVIENDAS_STALE_TIME
  })

export const useCrearVivienda = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: crearVivienda,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [BASE_VIVIENDA_QUERY] })
  })
}
