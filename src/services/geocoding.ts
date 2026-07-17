import ky from 'ky'
import {
  NOMINATIM_BASE_URL,
  NOMINATIM_LANG,
  NOMINATIM_REVERSE_ZOOM
} from '../constants/geocoding'
import type { AddressMeta, NominatimReverseResponse } from '../types/geocoding'

const nominatim = ky.create({
  prefix: NOMINATIM_BASE_URL,
  headers: { Accept: 'application/json' },
  retry: 0
})

/** Primer campo de barrio disponible en la respuesta de OSM. */
function extraerBarrio(
  address: NominatimReverseResponse['address']
): string | null {
  if (!address) return null
  return (
    address.neighbourhood ??
    address.suburb ??
    address.quarter ??
    address.city_district ??
    null
  )
}

function extraerCalle(
  address: NominatimReverseResponse['address']
): string | null {
  if (!address?.road) return null
  return address.house_number
    ? `${address.road} ${address.house_number}`
    : address.road
}

/**
 * Reverse geocoding: `(lat, lng)` → metadatos de dirección (calle, barrio,
 * ciudad). Devuelve `null` ante cualquier fallo o punto sin datos: es
 * best-effort y no debe romper el flujo del formulario (ver plan §4.5).
 */
export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<AddressMeta | null> => {
  try {
    const response = await nominatim
      .get('reverse', {
        searchParams: {
          lat,
          lon: lng,
          format: 'jsonv2',
          addressdetails: 1,
          zoom: NOMINATIM_REVERSE_ZOOM,
          'accept-language': NOMINATIM_LANG
        }
      })
      .json<NominatimReverseResponse>()

    if (response.error || !response.address) return null

    return {
      calle: extraerCalle(response.address),
      barrioNombre: extraerBarrio(response.address),
      ciudad:
        response.address.town ??
        response.address.city ??
        response.address.village ??
        null
    }
  } catch {
    return null
  }
}
