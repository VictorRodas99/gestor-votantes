import { cedulaDesdeCodigo } from '../lib/codigo'
import type { VotantesFilters } from '../services/votantes'

/**
 * Todo lo que no sea dígito es ruido de formato: guiones, puntos, comas,
 * espacios, barras. Tanto el código como la cédula se dictan y se copian con
 * separadores arbitrarios.
 */
const soloDigitos = (valor: string) => valor.replace(/\D+/g, '')

export function buildSearchFilters(search: string): Partial<VotantesFilters> {
  const trimmed = search.trim()
  if (!trimmed) return {}

  // El código es una biyección sobre la cédula, así que se resuelve acá y se
  // consulta con el filtro `?cedula=` que la API ya tiene: buscar por código
  // no le pide nada nuevo al server.
  const cedulaDelCodigo = cedulaDesdeCodigo(trimmed)
  if (cedulaDelCodigo) return { cedula: cedulaDelCodigo }

  // Sin letras es una cédula, venga como venga escrita.
  const digitos = soloDigitos(trimmed)
  const esCedula = digitos.length > 0 && !/\p{L}/u.test(trimmed)

  return esCedula ? { cedula: digitos } : { apellido: trimmed }
}
