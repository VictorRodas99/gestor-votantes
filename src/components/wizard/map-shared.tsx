import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { Marker, useMapEvents } from 'react-leaflet'

export type LatLng = [number, number]

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
