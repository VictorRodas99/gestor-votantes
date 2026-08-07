/**
 * Extrae el JSON de una respuesta que puede venir sucia.
 * cualquier notice de PHP se imprime **antes** del JSON y `JSON.parse`
 * revienta.
 */
export function parsearJsonSucio<T>(raw: string): T | null {
  const texto = raw.trim()
  if (texto === '') return null

  const directo = intentarParsear<T>(texto)
  if (directo !== null) return directo

  for (
    let inicio = texto.indexOf('{');
    inicio !== -1;
    inicio = texto.indexOf('{', inicio + 1)
  ) {
    const candidato = intentarParsear<T>(texto.slice(inicio))
    if (candidato !== null) return candidato
  }

  return null
}

function intentarParsear<T>(texto: string): T | null {
  try {
    return JSON.parse(texto) as T
  } catch {
    return null
  }
}

export function mensajeDeRespuestaSucia(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
