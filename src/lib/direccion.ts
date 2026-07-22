export type DireccionParseada = { calle: string; lat?: number; lng?: number }

function aCoordenada(valor: unknown) {
  const numero = Number(valor)
  return Number.isNaN(numero) ? undefined : numero
}

/**
 * Algunos votantes traen en `direccion` el objeto de ubicación serializado como
 * JSON (`{"calle":...,"lat":...,"lng":...}`) en vez del texto plano de la calle.
 * Lo detectamos y desarmamos para separar calle y coordenadas; si no es JSON,
 * el string entero es la calle.
 */
export function parsearDireccion(direccion: string): DireccionParseada {
  const texto = direccion.trim()

  try {
    const crudo = JSON.parse(texto) as Record<string, unknown>
    return {
      calle: typeof crudo.calle === 'string' ? crudo.calle : '',
      lat: aCoordenada(crudo.lat),
      lng: aCoordenada(crudo.lng)
    }
  } catch {
    return { calle: texto }
  }
}
