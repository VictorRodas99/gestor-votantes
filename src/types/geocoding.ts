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
