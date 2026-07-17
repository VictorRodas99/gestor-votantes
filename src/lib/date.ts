/** `true` si el string es una fecha parseable. */
export function esFechaValida(iso: string): boolean {
  return Boolean(iso) && !Number.isNaN(Date.parse(iso))
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
