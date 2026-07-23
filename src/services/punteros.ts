import { HTTPError } from 'ky'
import { PUNTERO_ROUTES } from '../constants/routes'
import type { PunteroFormData } from '../forms/puntero/puntero.schema'
import { toFormData } from '../lib/form-data'
import { toTitleCase } from '../lib/format'
import api from '../lib/http'
import type { PaginatedResponse } from '../types/api'
import type { Puntero, PunteroRaw } from '../types/puntero'

const PUNTEROS_PER_PAGE = 50

function mapPuntero(raw: PunteroRaw): Puntero {
  return {
    id: Number(raw.id),
    nombreApellido: toTitleCase(raw.nombre_apellido),
    cedula: raw.cedula,
    celular: raw.celular?.trim() ?? '',
    afiliacion: raw.afiliacion === '1',
    barrioId: Number(raw.barrio_id),
    sectorId: Number(raw.sector_id),
    transporte: raw.transporte?.trim() || null
  }
}

export const getPunteros = async (search = ''): Promise<Puntero[]> => {
  const searchParams: Record<string, string | number> = {
    per_page: PUNTEROS_PER_PAGE
  }

  const trimmed = search.trim()
  if (trimmed) {
    const digits = trimmed.replace(/\D/g, '')
    const isCedula = digits.length > 0 && /^[\d.\s]+$/.test(trimmed)
    if (isCedula) searchParams.cedula = digits
    else searchParams.nombre_apellido = trimmed
  }

  try {
    const response = await api
      .get(PUNTERO_ROUTES.index, { searchParams })
      .json<PaginatedResponse<PunteroRaw>>()

    return response.data.map(mapPuntero)
  } catch {
    return []
  }
}

export const getPunteroPorId = async (id: number): Promise<Puntero | null> => {
  try {
    const response = await api
      .get(PUNTERO_ROUTES.index, { searchParams: { id, per_page: 1 } })
      .json<PaginatedResponse<PunteroRaw>>()

    const raw = response.data[0]
    return raw ? mapPuntero(raw) : null
  } catch {
    return null
  }
}

export type CrearPunteroResponse = {
  success: true
  message: string
  /** PK del puntero creado/actualizado. */
  pkey: number
}

function toPunteroPayload(data: PunteroFormData): Record<string, unknown> {
  return {
    cedula: data.cedula,
    nombre_apellido: data.nombre_apellido,
    celular: data.celular,
    afiliacion: data.afiliacion,
    barrio_id: data.barrio_id ?? 0,
    sector_id: data.sector_id ?? 0,
    transporte: data.transporte?.trim() || null
  }
}

/**
 * Crea/actualiza un puntero contra el contrato asumido (form-data, upsert por
 * cédula).
 */
export const crearPuntero = async (
  data: PunteroFormData
): Promise<CrearPunteroResponse> => {
  let raw: string

  try {
    raw = await api
      .post(PUNTERO_ROUTES.post, { body: toFormData(toPunteroPayload(data)) })
      .text()
  } catch (reason) {
    if (reason instanceof HTTPError) {
      throw new Error(reason.message, { cause: reason })
    }

    throw new Error('No pudimos guardar el puntero. Intentá de nuevo.', {
      cause: reason
    })
  }

  let parsed: { success?: boolean; message?: string; pkey?: number | string }
  try {
    parsed = JSON.parse(raw)
  } catch (reason) {
    throw new Error(
      raw.trim() || 'No pudimos guardar el puntero. Intentá de nuevo.',
      { cause: reason }
    )
  }

  if (!parsed.success) {
    throw new Error(parsed.message || 'No pudimos guardar el puntero.')
  }

  return {
    success: true,
    message: parsed.message ?? 'Puntero guardado',
    pkey: Number(parsed.pkey)
  }
}
