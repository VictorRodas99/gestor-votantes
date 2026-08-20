import { HTTPError } from 'ky'
import { VIVIENDAS_PER_PAGE } from '../constants/config'
import { VIVIENDA_ROUTES } from '../constants/routes'
import type { ViviendaFormData } from '../forms/vivienda/vivienda.schema'
import { esCancelacion } from '../lib/abort'
import { mensajeDeRespuestaSucia, parsearJsonSucio } from '../lib/api-json'
import api from '../lib/http'
import type { PaginatedResponse } from '../types/api'
import type {
  Vivienda,
  ViviendaRaw,
  ViviendaUbicacion
} from '../types/vivienda'

/**
 * El endpoint guarda `ubicacion` como JSON crudo en un `varchar`; acá se hace el
 * camino inverso. Nunca lanza: una fila con JSON corrupto degrada a ubicación
 * vacía en vez de romper todo el listado.
 */
function parseUbicacion(raw: string): ViviendaUbicacion {
  try {
    const u = JSON.parse(raw) as Partial<ViviendaUbicacion>
    return {
      calle: typeof u.calle === 'string' ? u.calle : '',
      lat: typeof u.lat === 'number' ? u.lat : null,
      lng: typeof u.lng === 'number' ? u.lng : null
    }
  } catch {
    return { calle: '', lat: null, lng: null }
  }
}

/** Castea el registro crudo (todo string) al modelo de dominio. */
function mapVivienda(raw: ViviendaRaw): Vivienda {
  return {
    id: Number(raw.id),
    foto: raw.foto ?? '',
    descripcion: (raw.descripcion ?? '').trim(),
    ubicacion: parseUbicacion(raw.ubicacion ?? ''),
    usuarioId:
      raw.user_id != null && raw.user_id !== '' ? Number(raw.user_id) : null,
    createdAt: raw.created_at
  }
}

export type ViviendasFilters = {
  desde?: string
  hasta?: string
  id?: number
  page?: number
  perPage?: number
}

export type ViviendasResult = {
  viviendas: Vivienda[]
  page: number
}

export const getViviendas = async (
  filters: ViviendasFilters = {},
  { signal }: { signal?: AbortSignal } = {}
): Promise<ViviendasResult> => {
  const { desde, hasta, id, page = 1, perPage = VIVIENDAS_PER_PAGE } = filters

  const searchParams: Record<string, string | number> = {
    page,
    per_page: perPage
  }
  if (desde && hasta) {
    searchParams.desde = desde
    searchParams.hasta = hasta
  }
  if (id != null) searchParams.id = id

  try {
    const response = await api
      .get(VIVIENDA_ROUTES.index, { searchParams, signal })
      .json<PaginatedResponse<ViviendaRaw>>()

    return {
      viviendas: response.data.map(mapVivienda),
      page: Number(response.page) || page
    }
  } catch (reason) {
    if (esCancelacion(reason)) throw reason

    // 200 + texto plano ante error
    if (reason instanceof HTTPError) {
      throw new Error(reason.message, { cause: reason })
    }

    throw new Error('No pudimos cargar las viviendas. Intentá de nuevo.', {
      cause: reason
    })
  }
}

export function toViviendaFormData(data: ViviendaFormData): FormData {
  const form = new FormData()

  if (data.foto) form.append('foto', data.foto)
  if (data.descripcion) form.append('descripcion', data.descripcion)

  // el endpoint acá guarda crudo, no como en votaciones que hacía json_encode
  form.append(
    'ubicacion',
    JSON.stringify({
      calle: data.ubicacion.calle ?? '',
      lat: data.ubicacion.lat,
      lng: data.ubicacion.lng
    })
  )

  return form
}

export type CrearViviendaResponse = {
  success: true
  message: string
  /** PK de la vivienda creada. */
  pkey: number
}

const VIVIENDA_POST_TIMEOUT_MS = 20_000

export const crearVivienda = async (
  data: ViviendaFormData
): Promise<CrearViviendaResponse> => {
  let raw: string

  try {
    raw = await api
      .post(VIVIENDA_ROUTES.post, {
        body: toViviendaFormData(data),
        timeout: VIVIENDA_POST_TIMEOUT_MS
      })
      .text()
  } catch (reason) {
    if (reason instanceof HTTPError) {
      throw new Error(reason.message, { cause: reason })
    }

    throw new Error('No pudimos guardar la vivienda. Intentá de nuevo.', {
      cause: reason
    })
  }

  const parsed = parsearJsonSucio<{
    success?: boolean
    message?: string
    pkey?: number | string
  }>(raw)

  if (!parsed) {
    throw new Error(
      mensajeDeRespuestaSucia(raw) ||
        'No pudimos guardar la vivienda. Intentá de nuevo.'
    )
  }

  if (!parsed.success) {
    throw new Error(parsed.message || 'No pudimos guardar la vivienda.')
  }

  return {
    success: true,
    message: parsed.message ?? 'Vivienda guardada',
    pkey: Number(parsed.pkey)
  }
}
