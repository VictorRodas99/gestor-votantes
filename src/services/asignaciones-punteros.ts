import { HTTPError } from 'ky'
import { ASIGNACION_PUNTERO_ROUTES } from '../constants/routes'
import { toFormData } from '../lib/form-data'
import api from '../lib/http'
import type { PaginatedResponse } from '../types/api'
import type {
  AsignacionPuntero,
  AsignacionPunteroRaw
} from '../types/asignacion'

function mapAsignacion(raw: AsignacionPunteroRaw): AsignacionPuntero {
  return {
    id: Number(raw.id),
    votanteId: Number(raw.votante_id),
    punteroId: Number(raw.puntero_id)
  }
}

/**
 * Asignaciones de un votante (`?votante_id=` filtra — re-test 23-jul). Devuelve
 * solo las pocas filas del votante, sin traer toda la puente.
 */
export const getAsignacionesPunteros = async (
  votanteId: number
): Promise<AsignacionPuntero[]> => {
  try {
    const response = await api
      .get(ASIGNACION_PUNTERO_ROUTES.index, {
        searchParams: { votante_id: votanteId, per_page: 100 }
      })
      .json<PaginatedResponse<AsignacionPunteroRaw>>()

    return response.data.map(mapAsignacion)
  } catch {
    return []
  }
}

export type MutacionAsignacionResponse = {
  success: true
  message: string
}

async function postAsignacion(
  route: string,
  payload: Record<string, unknown>,
  mensajeError: string
): Promise<MutacionAsignacionResponse> {
  let raw: string

  try {
    raw = await api.post(route, { body: toFormData(payload) }).text()
  } catch (reason) {
    if (reason instanceof HTTPError) {
      throw new Error(reason.message, { cause: reason })
    }
    throw new Error(mensajeError, { cause: reason })
  }

  let parsed: { success?: boolean; message?: string }
  try {
    parsed = JSON.parse(raw)
  } catch (reason) {
    throw new Error(raw.trim() || mensajeError, { cause: reason })
  }

  if (!parsed.success) {
    throw new Error(parsed.message || mensajeError)
  }

  return { success: true, message: parsed.message ?? 'Listo' }
}

export const asignarPuntero = ({
  votanteId,
  punteroId
}: {
  votanteId: number
  punteroId: number
}) =>
  postAsignacion(
    ASIGNACION_PUNTERO_ROUTES.post,
    { votante_id: votanteId, puntero_id: punteroId },
    'No pudimos asignar el puntero. Intentá de nuevo.'
  )

/**
 * Baja de una asignación. Se envían las tres claves para cubrir ambas variantes
 * del contrato (por `id` de la fila, o por el par votante+puntero).
 */
export const desasignarPuntero = ({
  asignacionId,
  votanteId,
  punteroId
}: {
  asignacionId: number
  votanteId: number
  punteroId: number
}) =>
  postAsignacion(
    ASIGNACION_PUNTERO_ROUTES.delete,
    { id: asignacionId, votante_id: votanteId, puntero_id: punteroId },
    'No pudimos quitar el puntero. Intentá de nuevo.'
  )
