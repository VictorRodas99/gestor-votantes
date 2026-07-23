import { useCallback, useState } from 'react'

const STORAGE_KEY = 'asignacion:recientes'
const MAX_RECIENTES = 5

/** Lo mínimo que la card de recientes necesita; el resto se refetchea al elegir. */
export type VotanteReciente = {
  cedula: string
  nombreCompleto: string
}

function leer(): VotanteReciente[] {
  try {
    const crudo = localStorage.getItem(STORAGE_KEY)
    if (!crudo) return []
    const parsed = JSON.parse(crudo)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (item): item is VotanteReciente =>
          typeof item?.cedula === 'string' &&
          typeof item?.nombreCompleto === 'string'
      )
      .slice(0, MAX_RECIENTES)
  } catch {
    return []
  }
}

/**
 * Recientes de búsqueda en localStorage (máx 5). `registrar` dedupe por cédula
 * y mueve al frente. Todo envuelto en try/catch: en modo privado localStorage
 * puede fallar → degrada a lista vacía sin romper.
 */
export function useRecientesAsignacion() {
  const [recientes, setRecientes] = useState<VotanteReciente[]>(leer)

  const registrar = useCallback((votante: VotanteReciente) => {
    setRecientes((previos) => {
      const sinDuplicado = previos.filter((r) => r.cedula !== votante.cedula)
      const siguiente = [votante, ...sinDuplicado].slice(0, MAX_RECIENTES)

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(siguiente))
      } catch {
        // Modo privado / cuota: mantenemos el estado en memoria igual.
      }

      return siguiente
    })
  }, [])

  return { recientes, registrar }
}
