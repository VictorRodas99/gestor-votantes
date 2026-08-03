/** Cédulas de hasta 7 dígitos. Las mayores se pliegan (ver `cedulaANumero`). */
const DOMINIO = 10_000_000
/** `LADO² = 10.004.569 ≥ DOMINIO`; el excedente se resuelve con cycle walking. */
const LADO = 3163
const RONDAS = 6
const CLAVE = 0x5f3a91c7

/**
 * Tabla cuasigrupo de Damm: detecta el 100% de los errores de un dígito y de
 * las transposiciones adyacentes, y su salida es siempre un dígito.
 */
const DAMM = [
  [0, 3, 1, 7, 5, 9, 8, 6, 4, 2],
  [7, 0, 9, 2, 1, 5, 4, 8, 6, 3],
  [4, 2, 0, 6, 8, 7, 1, 3, 5, 9],
  [1, 7, 5, 0, 9, 8, 3, 4, 2, 6],
  [6, 1, 2, 3, 0, 4, 5, 9, 7, 8],
  [3, 6, 7, 4, 2, 0, 9, 5, 8, 1],
  [5, 8, 6, 9, 7, 2, 0, 1, 3, 4],
  [8, 9, 4, 5, 3, 6, 2, 0, 1, 7],
  [9, 4, 3, 8, 6, 1, 7, 2, 0, 5],
  [2, 5, 8, 1, 4, 3, 6, 7, 9, 0]
]

function damm(digitos: string): number {
  let acumulado = 0
  for (const digito of digitos) acumulado = DAMM[acumulado][Number(digito)]
  return acumulado
}

/** Mixer de 32 bits (finalización de Murmur3). */
function prf(ronda: number, x: number): number {
  let h =
    (CLAVE ^
      Math.imul(ronda + 1, 0x9e3779b1) ^
      Math.imul(x + 1, 0x85ebca6b)) >>>
    0
  h ^= h >>> 16
  h = Math.imul(h, 0x7feb352d) >>> 0
  h ^= h >>> 15
  h = Math.imul(h, 0x846ca68b) >>> 0
  h ^= h >>> 16
  return (h >>> 0) % LADO
}

function ronda(izquierda: number, derecha: number, indice: number) {
  return {
    izquierda: derecha,
    derecha: (izquierda + prf(indice, derecha)) % LADO
  }
}

/**
 * Feistel sobre `LADO²` con cycle walking: si el resultado cae en el excedente
 * (`≥ DOMINIO`) se vuelve a permutar. Preserva la biyección y termina siempre
 * — el excedente es 0,05% del espacio.
 */
function permutar(n: number): number {
  let x = n

  do {
    let izquierda = Math.floor(x / LADO)
    let derecha = x % LADO

    for (let indice = 0; indice < RONDAS; indice++) {
      ;({ izquierda, derecha } = ronda(izquierda, derecha, indice))
    }

    x = izquierda * LADO + derecha
  } while (x >= DOMINIO)

  return x
}

function despermutar(m: number): number {
  let x = m

  do {
    let izquierda = Math.floor(x / LADO)
    let derecha = x % LADO

    for (let indice = RONDAS - 1; indice >= 0; indice--) {
      const anterior =
        (((derecha - prf(indice, izquierda)) % LADO) + LADO) % LADO
      derecha = izquierda
      izquierda = anterior
    }

    x = izquierda * LADO + derecha
  } while (x >= DOMINIO)

  return x
}

function cedulaANumero(cedula: string): number | null {
  const digitos = cedula.replace(/\D+/g, '')
  if (!digitos) return null
  return Number(digitos) % DOMINIO
}

/** Quita separadores y espacios */
export function normalizarCodigo(entrada: string): string {
  return entrada.replace(/\D+/g, '')
}

export function esCodigoValido(entrada: string): boolean {
  const codigo = normalizarCodigo(entrada)
  return /^\d{8}$/.test(codigo) && damm(codigo) === 0
}

/**
 * Deja intacta la entrada si no es un código del formato vigente: los valores
 * viejos que hay en la base (`uniqid()` de 13 hex) se muestran tal cual en vez
 * de reagruparse como si fueran del formato nuevo.
 */
export function formatearCodigo(entrada: string): string {
  if (!esCodigoValido(entrada)) return entrada

  const codigo = normalizarCodigo(entrada)
  return `${codigo.slice(0, 3)}-${codigo.slice(3, 7)}-${codigo.slice(7)}`
}

export function codigoDesdeCedula(cedula: string): string {
  const n = cedulaANumero(cedula)
  if (n === null) return ''

  const payload = String(permutar(n)).padStart(7, '0')
  return payload + damm(payload)
}

/**
 * Inversa de `codigoDesdeCedula`. `null` si el código no es válido.
 *
 * Devuelve la cédula sin ceros a la izquierda para poder consultarla con el
 * filtro `?cedula=` de la API (match exacto server-side).
 */
export function cedulaDesdeCodigo(entrada: string): string | null {
  const codigo = normalizarCodigo(entrada)
  if (!esCodigoValido(codigo)) return null

  return String(despermutar(Number(codigo.slice(0, 7))))
}
