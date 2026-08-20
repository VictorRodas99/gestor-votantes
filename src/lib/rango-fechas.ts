export type RangoPreset = 'hoy' | 'ultimos7' | 'mes' | 'personalizado'

export type RangoFechas = { desde: string; hasta: string }

export type RangoCustom = { desde: string; hasta: string }

const INICIO_DIA = '00:00:00'
const FIN_DIA = '23:59:59'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Date local → `YYYY-MM-DD` (sin UTC, para no correrse de día por zona horaria). */
function ymd(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function rango(desdeYmd: string, hastaYmd: string): RangoFechas {
  return { desde: `${desdeYmd} ${INICIO_DIA}`, hasta: `${hastaYmd} ${FIN_DIA}` }
}

export function rangoDesdePreset(
  preset: RangoPreset,
  custom?: RangoCustom
): RangoFechas | null {
  const hoy = new Date()

  switch (preset) {
    case 'hoy':
      return rango(ymd(hoy), ymd(hoy))
    case 'ultimos7': {
      const desde = new Date(hoy)
      desde.setDate(desde.getDate() - 6)
      return rango(ymd(desde), ymd(hoy))
    }
    case 'mes': {
      const primero = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      return rango(ymd(primero), ymd(hoy))
    }
    case 'personalizado':
      return custom?.desde && custom.hasta
        ? rango(custom.desde, custom.hasta)
        : null
  }
}
