import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { toast } from 'sonner'
import {
  COLUMNAS_VOTANTE,
  NOMBRE_HOJA,
  nombreArchivoVotantes,
  type ContextoExport
} from '../constants/exportacion-votantes'
import { esCancelacion } from '../lib/abort'
import { descargarExcel } from '../lib/exportar-excel'
import { formatNumero } from '../lib/format'
import { getVotantesTodos, type VotantesFilters } from '../services/votantes'
import type { Votante } from '../types/votante'
import { useLocalesVotacion } from './services/catalogos'

/** `visibles` = lo que está renderizado; `todos` = todo lo que matchea los filtros. */
export type AlcanceExport = 'visibles' | 'todos'

const TOAST_EXPORT = 'exportar-votantes'

/**
 * sin esto el resultado hereda el botón Cancelar (que ya no
 * cancela nada) y el `duration: Infinity`, que le saltea el auto-cierre
 */
const TOAST_FIN = {
  id: TOAST_EXPORT,
  action: undefined,
  duration: undefined
}

type UseExportarVotantesProps = {
  filters: VotantesFilters
  visibles: Votante[]
}

export function useExportarVotantes({
  filters,
  visibles
}: UseExportarVotantesProps) {
  const { data: locales } = useLocalesVotacion()
  const controllerRef = useRef<AbortController | null>(null)

  const cancelar = () => controllerRef.current?.abort()

  const mutation = useMutation({
    mutationFn: async (alcance: AlcanceExport) => {
      const controller = new AbortController()
      controllerRef.current = controller
      const { signal } = controller

      const ctx: ContextoExport = {
        locales: new Map(
          (locales ?? []).map((local) => [local.id, local.denominacion])
        )
      }

      const avisar = (mensaje: string) =>
        toast.loading(mensaje, {
          id: TOAST_EXPORT,
          duration: Infinity,
          // Solo tiene sentido cancelar si hay requests en curso.
          action:
            alcance === 'todos'
              ? {
                  label: 'Cancelar',
                  onClick: (event) => {
                    event.preventDefault()
                    cancelar()
                    // Sin `action`: ya se está cancelando, el botón sería inerte.
                    toast.loading('Cancelando…', {
                      id: TOAST_EXPORT,
                      action: undefined,
                      duration: Infinity
                    })
                  }
                }
              : undefined
        })

      try {
        avisar('Preparando la exportación…')

        const filas =
          alcance === 'visibles'
            ? visibles
            : await getVotantesTodos(filters, {
                signal,
                onProgress: (cargados, total) =>
                  avisar(
                    `Descargando votantes… ${formatNumero(cargados)} de ${formatNumero(total)}`
                  )
              })

        await descargarExcel(filas, COLUMNAS_VOTANTE, ctx, {
          nombreArchivo: nombreArchivoVotantes(),
          hoja: NOMBRE_HOJA,
          signal
        })

        toast.success(
          `Se exportaron ${formatNumero(filas.length)} votantes.`,
          TOAST_FIN
        )

        return filas.length
      } catch (error) {
        if (esCancelacion(error)) {
          toast.info('Exportación cancelada.', TOAST_FIN)
        } else {
          toast.error(
            error instanceof Error && error.message
              ? error.message
              : 'No pudimos generar el archivo.',
            TOAST_FIN
          )
        }

        throw error
      } finally {
        controllerRef.current = null
      }
    }
  })

  return { exportar: mutation.mutate, cancelar, isPending: mutation.isPending }
}
