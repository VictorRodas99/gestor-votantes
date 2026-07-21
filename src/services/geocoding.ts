import ky from 'ky'
import {
  NOMINATIM_BASE_URL,
  NOMINATIM_LANG,
  NOMINATIM_REVERSE_ZOOM,
  NOMINATIM_SEARCH_LIMIT,
  SUGERENCIAS_MAX
} from '../constants/geocoding'
import { CIUDAD_COORDS_CENTER, CIUDAD_VIEWBOX } from '../constants/map'
import { distanciaAprox } from '../lib/geo'
import type {
  AddressMeta,
  DireccionSugerida,
  NominatimReverseResponse,
  NominatimSearchResult
} from '../types/geocoding'

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
  } catch (error) {
    console.warn('[geocoding] reverse falló', error)
    return null
  }
}

const VIEWBOX = [
  CIUDAD_VIEWBOX.lonMin,
  CIUDAD_VIEWBOX.latMin,
  CIUDAD_VIEWBOX.lonMax,
  CIUDAD_VIEWBOX.latMax
].join(',')

const [CENTRO_LAT, CENTRO_LNG] = CIUDAD_COORDS_CENTER

function mapSugerencia(
  resultado: NominatimSearchResult
): DireccionSugerida | null {
  const etiqueta = extraerCalle(resultado.address) ?? resultado.name
  if (!etiqueta) return null

  const detalle = [extraerBarrio(resultado.address), resultado.address?.town]
    .filter(Boolean)
    .join(' · ')

  return {
    id: String(resultado.place_id),
    etiqueta,
    detalle,
    lat: Number(resultado.lat),
    lng: Number(resultado.lon),
    barrioNombre: extraerBarrio(resultado.address)
  }
}

const buscarCrudo = (query: string) =>
  nominatim
    .get('search', {
      searchParams: {
        q: query,
        format: 'jsonv2',
        addressdetails: 1,
        limit: NOMINATIM_SEARCH_LIMIT,
        viewbox: VIEWBOX,
        // Sin `bounded` aparecerían calles homónimas de Asunción o Argentina.
        bounded: 1,
        'accept-language': NOMINATIM_LANG
      }
    })
    .json<NominatimSearchResult[]>()

export const buscarDirecciones = async (
  query: string
): Promise<DireccionSugerida[]> => {
  const texto = query.trim()
  if (!texto) return []

  try {
    let crudos = await buscarCrudo(texto)

    // La cobertura de `house_number` en Pilar es parcial
    const sinNumero = texto.replace(/\s+\d+\s*$/, '')
    if (crudos.length === 0 && sinNumero !== texto) {
      crudos = await buscarCrudo(sinNumero)
    }

    const sugerencias = crudos
      .map(mapSugerencia)
      .filter((s): s is DireccionSugerida => s !== null)
      .sort(
        (a, b) =>
          distanciaAprox(a, { lat: CENTRO_LAT, lng: CENTRO_LNG }) -
          distanciaAprox(b, { lat: CENTRO_LAT, lng: CENTRO_LNG })
      )

    // depup porque las calles se devuelven en varios `way`
    const vistas = new Set<string>()
    return sugerencias
      .filter((s) => {
        const clave = `${s.etiqueta}|${s.detalle}`
        if (vistas.has(clave)) return false
        vistas.add(clave)
        return true
      })
      .slice(0, SUGERENCIAS_MAX)
  } catch (error) {
    console.warn('[geocoding] búsqueda falló', error)
    return []
  }
}
