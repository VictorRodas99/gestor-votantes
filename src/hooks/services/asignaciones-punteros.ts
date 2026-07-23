import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import {
  asignarPuntero,
  desasignarPuntero,
  getAsignacionesPunteros
} from '../../services/asignaciones-punteros'
import { getPunteroPorId } from '../../services/punteros'
import type { Puntero } from '../../types/puntero'
import { useBarrios } from './catalogos'
import { BASE_PUNTERO_QUERY } from './punteros'

export const BASE_ASIGNACION_PUNTERO_QUERY = 'asignaciones-punteros'
const ASIGNACION_STALE_TIME = 1000 * 30 // 30 s: es lo que muta

/** View-model de un puntero ya asignado a un votante. */
export type PunteroAsignado = Puntero & {
  /** PK de la fila puente, necesaria para la baja. */
  asignacionId: number
  barrioNombre: string
}

export const useAsignacionesPunteros = (votanteId?: number) => {
  return useQuery({
    queryKey: [BASE_ASIGNACION_PUNTERO_QUERY, votanteId],
    queryFn: () => getAsignacionesPunteros(votanteId as number),
    enabled: votanteId != null,
    staleTime: ASIGNACION_STALE_TIME
  })
}

/**
 * Hook derivado: compone la lista de punteros asignados a un votante. Las
 * asignaciones dan el par (asignacionId, punteroId); el detalle de cada puntero
 * son N queries por id, paralelas y cacheadas (N = punteros del votante, pocos).
 * El barrio se resuelve contra el catálogo `/barrios`.
 */
export const usePunterosAsignados = (votanteId?: number) => {
  const asignacionesQuery = useAsignacionesPunteros(votanteId)
  const asignaciones = asignacionesQuery.data ?? []

  const { data: barrios } = useBarrios()

  const punterosQueries = useQueries({
    queries: asignaciones.map((asignacion) => ({
      queryKey: [BASE_PUNTERO_QUERY, 'detalle', asignacion.punteroId],
      queryFn: () => getPunteroPorId(asignacion.punteroId),
      staleTime: 1000 * 60 * 5,
      enabled: votanteId != null
    }))
  })

  const punteros: PunteroAsignado[] = asignaciones
    .map((asignacion, index) => {
      const puntero = punterosQueries[index]?.data
      if (!puntero) return null // baja concurrente: el puntero ya no existe

      const barrioNombre =
        barrios?.find((b) => b.id === puntero.barrioId)?.denominacion ?? ''

      return { ...puntero, asignacionId: asignacion.id, barrioNombre }
    })
    .filter((p): p is PunteroAsignado => p !== null)

  const isPending =
    asignacionesQuery.isPending ||
    punterosQueries.some((query) => query.isPending && query.fetchStatus !== 'idle')

  const isError =
    asignacionesQuery.isError || punterosQueries.some((query) => query.isError)

  return {
    punteros,
    isPending,
    isError,
    refetch: asignacionesQuery.refetch
  }
}

export const useAsignarPuntero = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: asignarPuntero,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [BASE_ASIGNACION_PUNTERO_QUERY]
      })
  })
}

export const useDesasignarPuntero = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: desasignarPuntero,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [BASE_ASIGNACION_PUNTERO_QUERY]
      })
  })
}
