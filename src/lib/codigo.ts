/**
 * Código único del votante, con el mismo formato que el `uniqid()` de PHP
 */
export function generarCodigoUnico(): string {
  const segundos = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, '0')

  const bytes = crypto.getRandomValues(new Uint8Array(3))
  const aleatorio = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, '0')
  )
    .join('')
    .slice(0, 5)

  return segundos + aleatorio
}
