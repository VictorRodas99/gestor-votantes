import Fuse from 'fuse.js'
import type { CatalogoItem } from '../../types/catalogo'

// Fuse.js hace el trabajo pesado: normaliza (ignoreDiacritics) y puntúa la
// similitud contra las 34 `denominacion`. La tabla `barrios` no tiene geo, así
// que emparejar por nombre es lo máximo posible. `score` de Fuse:
// 0 = perfecto, 1 = nulo.
const EXACT_SCORE = 0.05 // prácticamente idéntico → autoseleccionar
const SUGGEST_SCORE = 0.4 // parecido → solo sugerir

export type BarrioMatch = {
  item: CatalogoItem
  /** true si la coincidencia es lo bastante fuerte para autoseleccionar. */
  exact: boolean
}

/**
 * Busca el barrio del catálogo que mejor coincide con el nombre que devolvió
 * Nominatim. Devuelve `null` si no hay nada suficientemente parecido.
 */
export function matchBarrio(
  nombreOSM: string | null,
  barrios: CatalogoItem[]
): BarrioMatch | null {
  if (!nombreOSM || barrios.length === 0) return null

  const fuse = new Fuse(barrios, {
    keys: ['denominacion'],
    includeScore: true,
    ignoreDiacritics: true,
    threshold: SUGGEST_SCORE
  })

  const [best] = fuse.search(nombreOSM)
  if (!best) return null

  return { item: best.item, exact: (best.score ?? 1) <= EXACT_SCORE }
}
