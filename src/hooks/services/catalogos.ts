import { useQuery } from '@tanstack/react-query'
import {
  getBarrios,
  getLocalesVotacion,
  getSectores
} from '../../services/catalogos'

const CATALOGO_STALE_TIME = 1000 * 60 * 60 // 1 hora

export const useLocalesVotacion = () => {
  return useQuery({
    queryKey: ['catalogo', 'local_votacion'],
    queryFn: getLocalesVotacion,
    staleTime: CATALOGO_STALE_TIME
  })
}

export const useBarrios = () => {
  return useQuery({
    queryKey: ['catalogo', 'barrios'],
    queryFn: getBarrios,
    staleTime: CATALOGO_STALE_TIME
  })
}

export const useSectores = () => {
  return useQuery({
    queryKey: ['catalogo', 'sectores'],
    queryFn: getSectores,
    staleTime: CATALOGO_STALE_TIME
  })
}
