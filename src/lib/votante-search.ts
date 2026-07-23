import type { VotantesFilters } from '../services/votantes'

export function buildSearchFilters(search: string): Partial<VotantesFilters> {
  const trimmed = search.trim()
  if (!trimmed) return {}

  const digits = trimmed.replace(/\D/g, '')
  const isCedula = digits.length > 0 && /^[\d.\s]+$/.test(trimmed)

  return isCedula ? { cedula: digits } : { apellido: trimmed }
}
