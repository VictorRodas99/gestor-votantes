import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useEffect } from 'react'
import { Marker, useMap, useMapEvents } from 'react-leaflet'
import { MAP_FOCUS_ZOOM } from '../../constants/map'

export type LatLng = [number, number]

export function RecentrarMapa({ position }: { position: LatLng | null }) {
  const map = useMap()

  const lat = position?.[0]
  const lng = position?.[1]

  useEffect(() => {
    if (lat == null || lng == null) return
    if (map.getBounds().contains([lat, lng])) return

    map.flyTo([lat, lng], Math.max(map.getZoom(), MAP_FOCUS_ZOOM), {
      duration: 0.6
    })
  }, [map, lat, lng])

  return null
}

const markerDefaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

/** Marcador que se coloca al tocar el mapa y se puede arrastrar. */
export function ClickMarker({
  position,
  onChange
}: {
  position: LatLng | null
  onChange: (position: LatLng) => void
}) {
  useMapEvents({
    click(event) {
      onChange([event.latlng.lat, event.latlng.lng])
    }
  })

  if (!position) return null

  return (
    <Marker
      position={position}
      icon={markerDefaultIcon}
      draggable
      eventHandlers={{
        dragend(event) {
          const { lat, lng } = event.target.getLatLng()
          onChange([lat, lng])
        }
      }}
    />
  )
}
