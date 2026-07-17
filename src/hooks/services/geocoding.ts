import { useMutation } from '@tanstack/react-query'
import { reverseGeocode } from '../../services/geocoding'

export const useReverseGeocode = () =>
  useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) =>
      reverseGeocode(lat, lng)
  })
