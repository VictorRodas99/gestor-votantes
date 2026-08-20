import { HTTPError } from 'ky'
import { VIVIENDA_ROUTES } from '../constants/routes'
import type { ViviendaFormData } from '../forms/vivienda/vivienda.schema'
import { mensajeDeRespuestaSucia, parsearJsonSucio } from '../lib/api-json'
import { appendCampo } from '../lib/form-data'
import api from '../lib/http'

export function toViviendaFormData(data: ViviendaFormData): FormData {
  const form = new FormData()

  if (data.foto) form.append('foto', data.foto)
  if (data.descripcion) appendCampo(form, 'descripcion', data.descripcion)

  appendCampo(form, 'ubicacion', {
    calle: data.ubicacion.calle ?? '',
    lat: data.ubicacion.lat,
    lng: data.ubicacion.lng
  })

  return form
}

export type CrearViviendaResponse = {
  success: true
  message: string
  /** PK de la vivienda creada. */
  pkey: number
}

export const crearVivienda = async (
  data: ViviendaFormData
): Promise<CrearViviendaResponse> => {
  let raw: string

  try {
    raw = await api
      .post(VIVIENDA_ROUTES.post, { body: toViviendaFormData(data) })
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
