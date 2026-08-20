/** `true` si el string es una fecha parseable. */
export function esFechaValida(iso: string): boolean {
  return Boolean(iso) && !Number.isNaN(Date.parse(iso))
}

const FMT_FECHA_CORTA = new Intl.DateTimeFormat('es', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
})

/**
 * `YYYY-MM-DD HH:MM:SS` → `20 ago 2026`. El `replace(' ', 'T')` es porque Safari
 * no parsea el formato con espacio.
 */
export function formatFechaCorta(fecha: string): string {
  if (!esFechaValida(fecha)) return ''
  return FMT_FECHA_CORTA.format(new Date(fecha.replace(' ', 'T')))
}

export function calcularEdad(iso: string): number {
  const nacimiento = new Date(iso)
  const hoy = new Date()

  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const diffMes = hoy.getMonth() - nacimiento.getMonth()

  if (diffMes < 0 || (diffMes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }

  return edad
}
