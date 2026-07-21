import { useMutation, useQuery } from '@tanstack/react-query'
import { BUSQUEDA_MIN_CHARS } from '../../constants/geocoding'
import { buscarDirecciones, reverseGeocode } from '../../services/geocoding'

const BASE_GEOCODING_QUERY = ['geocoding'] as const

export const useReverseGeocode = () =>
  useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) =>
      reverseGeocode(lat, lng)
  })

export const useBuscarDirecciones = (query: string) =>
  useQuery({
    queryKey: [...BASE_GEOCODING_QUERY, 'buscar', query],
    queryFn: () => buscarDirecciones(query),
    enabled: query.trim().length >= BUSQUEDA_MIN_CHARS,
    staleTime: Infinity
  })
