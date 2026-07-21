// Respuesta parcial de Nominatim `/reverse`
export type NominatimAddress = {
  road?: string
  house_number?: string
  neighbourhood?: string
  suburb?: string
  quarter?: string
  city_district?: string
  town?: string
  city?: string
  village?: string
}

export type NominatimReverseResponse = {
  address?: NominatimAddress
  display_name?: string
  // Nominatim devuelve `{ error: "Unable to geocode" }` cuando no hay resultado.
  error?: string
}

/** Metadatos ya mapeados a nuestro dominio. */
export type AddressMeta = {
  calle: string | null
  barrioNombre: string | null
  ciudad: string | null
}

// Respuesta parcial de Nominatim `/search`. Igual que en la API principal,
// `lat`/`lon` llegan como STRING: hay que castear en el map del servicio.
export type NominatimSearchResult = {
  place_id: number
  lat: string
  lon: string
  name?: string
  addresstype?: string
  address?: NominatimAddress
}

/** Sugerencia de dirección lista para pintar en el Autocomplete. */
export type DireccionSugerida = {
  id: string
  /** Línea principal: "Alberdi 1234" */
  etiqueta: string
  /** Línea secundaria: "Loma Clavel · Pilar" */
  detalle: string
  lat: number
  lng: number
  barrioNombre: string | null
}
