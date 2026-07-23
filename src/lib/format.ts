import { format } from '@react-input/number-format'

const THOUSANDS_OPTIONS = {
  locales: 'de-DE',
  maximumFractionDigits: 0
} as const

/**
 * Formatea una cédula con puntos de miles: `2497375` → `"2.497.375"`.
 */
export function formatCedula(cedula: string): string {
  const numeric = Number(cedula)

  if (!cedula || Number.isNaN(numeric)) {
    return cedula
  }

  return format(numeric, THOUSANDS_OPTIONS)
}

/**
 * Capitaliza un texto que viene en MAYÚSCULAS de la API (`"ABDO DE GARCIA"` →
 * `"Abdo De Garcia"`) para mostrarlo con Title Case.
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Iniciales para el avatar a partir del nombre completo: primera letra de la
 * primera y de la última palabra (`"Saidy Abdo"` → `"SA"`). Cae a una sola letra
 * si hay un solo término.
 */
export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'

  const first = parts[0].charAt(0)
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : ''

  return `${first}${last}`.toUpperCase() || '?'
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }

  return text.slice(0, maxLength).trimEnd() + '…'
}
