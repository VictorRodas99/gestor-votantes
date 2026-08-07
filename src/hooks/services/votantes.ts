import {
  keepPreviousData,
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { esCelularValido, normalizarCelular } from '../../lib/telefono'
import { buildSearchFilters } from '../../lib/votante-search'
import {
  crearVotante,
  getVotanteByCedula,
  getVotantes,
  getVotantesPorCelular,
  type VotantesFilters
} from '../../services/votantes'

export const BASE_VOTANTE_QUERY = 'votantes'
const VOTANTES_STALE_TIME = 1000 * 30 // 30 secs
const VOTANTES_BUSQUEDA_PER_PAGE = 15
/** Sobrevive a salir del wizard y volver a entrar. */
const CELULAR_GC_TIME = 1000 * 60 * 30

/**
 * Búsqueda de votante para la asignación. Sin filtro de visitado.
 */
export const useVotantesBusqueda = (search: string) => {
  const filters = buildSearchFilters(search)

  return useQuery({
    queryKey: [BASE_VOTANTE_QUERY, 'busqueda', search],
    queryFn: () =>
      getVotantes({ ...filters, perPage: VOTANTES_BUSQUEDA_PER_PAGE }),
    enabled: search.trim().length > 0,
    staleTime: VOTANTES_STALE_TIME
  })
}

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

/**
 * Opciones compartidas por la verificación en vivo (`useCelularTomado`) y por
 * el gate del botón (`fetchQuery`): misma key ⇒ **una sola** entrada de caché,
 * que es lo que evita repetir la consulta del mismo número en la sesión.
 *
 * `staleTime: Infinity` es seguro porque la única escritura de celulares que
 * hace la app es el POST del wizard, y `useCrearVotante` ya invalida
 * `[BASE_VOTANTE_QUERY]` entero al terminar.
 */
export const opcionesCelular = (celular: string) =>
  queryOptions({
    // Sin la cédula a propósito: la respuesta del server es la misma para
    // todos; excluir al propio votante es una lectura sobre el resultado.
    queryKey: [BASE_VOTANTE_QUERY, 'por-celular', normalizarCelular(celular)],
    queryFn: ({ signal }) => getVotantesPorCelular(celular, { signal }),
    staleTime: Infinity,
    gcTime: CELULAR_GC_TIME,
    // Fallar rápido: ante error no se bloquea el alta (fail-open).
    retry: false
  })

/**
 * ¿El celular ya está cargado en **otro** votante? Un match con la misma cédula
 * es el propio votante prellenado desde el padrón, y no es conflicto.
 */
export const useCelularTomado = (celular: string, cedulaPropia: string) => {
  const habilitado = esCelularValido(celular)

  const { data, isFetching, isError } = useQuery({
    ...opcionesCelular(celular),
    enabled: habilitado
  })

  return {
    verificando: habilitado && isFetching,
    tomado: Boolean(data?.some((votante) => votante.cedula !== cedulaPropia)),
    verificado: habilitado && !isFetching && data != null,
    falloVerificacion: isError
  }
}

/**
 * Chequeo puntual para bloquear el avance: sale de la caché si el número ya se
 * verificó y, si no, espera la consulta (cubre "pulsó Siguiente antes de que
 * corriera el debounce").
 */
export const useAsegurarCelularLibre = () => {
  const queryClient = useQueryClient()

  return async (celular: string, cedulaPropia: string): Promise<boolean> => {
    // `fetchQuery` no respeta `enabled`, así que el guard va acá.
    if (!esCelularValido(celular)) return true

    try {
      const votantes = await queryClient.fetchQuery(opcionesCelular(celular))
      return !votantes.some((votante) => votante.cedula !== cedulaPropia)
    } catch {
      // No bloquear un alta por una falla de red: el duplicado se corrige
      // después, el votante en la puerta de la casa se pierde.
      return true
    }
  }
}

/**
 * Detalle de un votante por cédula (panel / modal de detalle). Solo consulta
 * cuando hay una cédula seleccionada.
 */
export const useVotante = (cedula: string | null) => {
  return useQuery({
    queryKey: [BASE_VOTANTE_QUERY, 'detalle', cedula],
    queryFn: () => getVotanteByCedula(cedula as string),
    enabled: Boolean(cedula),
    staleTime: VOTANTES_STALE_TIME
  })
}

/**
 * `enabled` existe para que la página pueda suscribirse a la misma query que la
 * lista (y así saber qué filas están renderizadas) sin disparar la del
 * breakpoint que no está montado. Misma key ⇒ un solo fetch.
 */
export const useVotantesPaged = (
  filters: VotantesFilters = {},
  page: number,
  { enabled = true }: { enabled?: boolean } = {}
) => {
  return useQuery({
    queryKey: [BASE_VOTANTE_QUERY, 'paged', filters, page],
    queryFn: () => getVotantes({ ...filters, page }),
    placeholderData: keepPreviousData,
    staleTime: VOTANTES_STALE_TIME,
    enabled
  })
}

export const useCrearVotante = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: crearVotante,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [BASE_VOTANTE_QUERY] })
  })
}

export const useVotantesInfinite = (
  filters: VotantesFilters = {},
  { enabled = true }: { enabled?: boolean } = {}
) => {
  return useInfiniteQuery({
    enabled,
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
