import {
  parsePhoneNumberFromString,
  type MetadataJson
} from 'libphonenumber-js/core'
import metadata from './metadata-py.json'

/**
 * Metadata generada solo para Paraguay, generar de nuevo en cada versión nueva de la librería
 */
const METADATA = metadata as unknown as MetadataJson

const PAIS = 'PY' as const

function parsear(valor: string) {
  return parsePhoneNumberFromString(valor.trim(), PAIS, METADATA)
}

export function esCelularValido(valor: string): boolean {
  const numero = parsear(valor)
  return numero?.isValid() === true && numero.getType() === 'MOBILE'
}

/**
 * Forma canónica nacional (`0991123456`)
 */
export function normalizarCelular(valor: string): string {
  const numero = parsear(valor)
  if (!numero) return valor.replace(/\D/g, '')
  return `0${numero.nationalNumber}`
}

/** solo para mostrar. */
export function formatearCelular(valor: string): string {
  return parsear(valor)?.formatNational() ?? valor
}
