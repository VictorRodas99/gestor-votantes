import 'leaflet/dist/leaflet.css'

import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import { toast } from 'sonner'
import { CIUDAD_COORDS_CENTER, MAP_DEFAULT_ZOOM } from '../../constants/map'

// Fix del ícono por defecto de Leaflet con bundlers (las URLs relativas se rompen).
const markerDefaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

type LatLng = [number, number]

/** Marcador que se coloca al tocar el mapa y se puede arrastrar. */
function ClickMarker({
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

type MapPickerProps = {
  open: boolean
  lat?: number
  lng?: number
  onClose: () => void
  onConfirm: (lat: number, lng: number) => void
}

/**
 * Selector de ubicación en mapa (Leaflet + OpenStreetMap): permite elegir un
 * punto **arbitrario** tocando/arrastrando el pin, o usar el GPS. Se carga de
 * forma diferida (solo al abrir) por el peso de Leaflet.
 */
export default function MapPicker({
  open,
  lat,
  lng,
  onClose,
  onConfirm
}: MapPickerProps) {
  const initial: LatLng | null = lat != null && lng != null ? [lat, lng] : null
  const [position, setPosition] = useState<LatLng | null>(initial)
  const [map, setMap] = useState<L.Map | null>(null)

  // El mapa dentro de un Dialog animado puede montar con tamaño incorrecto.
  useEffect(() => {
    if (!map) return
    const id = window.setTimeout(() => map.invalidateSize(), 150)
    return () => window.clearTimeout(id)
  }, [map])

  const usarGps = () => {
    if (!navigator.geolocation) {
      toast.error('Este dispositivo no permite geolocalización.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const punto: LatLng = [pos.coords.latitude, pos.coords.longitude]
        setPosition(punto)
        map?.setView(punto, MAP_DEFAULT_ZOOM)
      },
      () => toast.error('No pudimos obtener la ubicación.')
    )
  }

  const confirmar = () => {
    if (!position) {
      toast.error('Tocá el mapa para elegir un punto.')
      return
    }
    onConfirm(position[0], position[1])
  }

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle>Elegir ubicación</DialogTitle>
      <DialogContent dividers sx={{ p: 0 }} className="relative">
        <MapContainer
          center={initial ?? CIUDAD_COORDS_CENTER}
          zoom={MAP_DEFAULT_ZOOM}
          ref={setMap}
          style={{ display: 'absolute', height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickMarker position={position} onChange={setPosition} />
        </MapContainer>
      </DialogContent>
      <DialogActions className="flex flex-col">
        <p className="w-full px-4 py-2 text-label-sm text-text-secondary">
          {position
            ? `${position[0].toFixed(5)}, ${position[1].toFixed(5)}`
            : 'Tocá el mapa o arrastrá el pin para elegir un punto.'}
        </p>
        <div className="flex w-full">
          <Button onClick={usarGps} startIcon={<MyLocationRoundedIcon />}>
            Mi ubicación
          </Button>
          <span className="flex-1" />
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={confirmar}>
            Confirmar
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
