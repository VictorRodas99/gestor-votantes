import { HTTPError } from 'ky'
import { VIVIENDA_ROUTES } from '../constants/routes'
import type { ViviendaFormData } from '../forms/vivienda/vivienda.schema'
import { mensajeDeRespuestaSucia, parsearJsonSucio } from '../lib/api-json'
import api from '../lib/http'

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
