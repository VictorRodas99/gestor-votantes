import { useQuery } from '@tanstack/react-query'
import { getResumenCampana } from '../../services/resumen'

export const BASE_RESUMEN_QUERY = 'resumen'
const RESUMEN_STALE_TIME = 1000 * 60 * 5 // 5 min

/**
 * Contadores globales de la campaña (`/info`) que alimentan los KPIs del Inicio.
 */
export const useResumenCampana = () => {
  return useQuery({
    queryKey: [BASE_RESUMEN_QUERY, 'campana'],
    queryFn: getResumenCampana,
    staleTime: RESUMEN_STALE_TIME
  })
}
