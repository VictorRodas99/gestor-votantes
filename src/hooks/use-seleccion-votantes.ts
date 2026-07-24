import { useState } from 'react'
import type { Votante } from '../types/votante'

/**
 * Selección múltiple de votantes para la asignación desktop. Guarda el `Votante`
 * completo (no solo el id) para que el panel de gestión muestre nombre/CI aunque
 * la selección abarque varias páginas o cambien los filtros.
 */
export function useSeleccionVotantes() {
  const [seleccion, setSeleccion] = useState<Map<number, Votante>>(new Map())

  const toggle = (votante: Votante) =>
    setSeleccion((prev) => {
      const next = new Map(prev)
      if (next.has(votante.id)) next.delete(votante.id)
      else next.set(votante.id, votante)
      return next
    })

  const togglePage = (votantes: Votante[], seleccionar: boolean) =>
    setSeleccion((prev) => {
      const next = new Map(prev)
      votantes.forEach((votante) =>
        seleccionar ? next.set(votante.id, votante) : next.delete(votante.id)
      )
      return next
    })

  const limpiar = () => setSeleccion(new Map())

  return { seleccion, toggle, togglePage, limpiar }
}
