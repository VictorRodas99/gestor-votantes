import 'leaflet/dist/leaflet.css'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import Button from '@mui/material/Button'
import type L from 'leaflet'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { CIUDAD_COORDS_CENTER, MAP_DEFAULT_ZOOM } from '../../constants/map'
import { useUbicacionVotante } from '../../hooks/use-ubicacion-votante'
import { ClickMarker, type LatLng } from './map-shared'

export default function MapInline() {
  const {
    lat,
    lng,
    tieneCoordenadas,
    locating,
    aplicarUbicacion,
    capturarUbicacion
  } = useUbicacionVotante()
  const [map, setMap] = useState<L.Map | null>(null)

  const position: LatLng | null = lat != null && lng != null ? [lat, lng] : null

  useEffect(() => {
    if (!map) return
    const id = window.setTimeout(() => map.invalidateSize(), 150)
    return () => window.clearTimeout(id)
  }, [map])

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-150 overflow-hidden rounded-lg border border-divider">
        <MapContainer
          center={position ?? CIUDAD_COORDS_CENTER}
          zoom={MAP_DEFAULT_ZOOM}
          ref={setMap}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickMarker
            position={position}
            onChange={([nextLat, nextLng]) =>
              aplicarUbicacion(nextLat, nextLng)
            }
          />
        </MapContainer>

        <div className="pointer-events-none absolute inset-x-3 top-3 z-1000 flex flex-col items-end gap-3">
          <span className="flex items-center gap-1 rounded-md bg-surface-container-lowest/95 px-3 py-1.5 text-label-sm font-medium text-text-secondary shadow-card">
            <PlaceRoundedIcon fontSize="inherit" className="text-primary" />
            {tieneCoordenadas
              ? `${lat!.toFixed(5)}, ${lng!.toFixed(5)}`
              : 'Sin ubicación'}
          </span>
          <Button
            variant="contained"
            size="small"
            className="pointer-events-auto shrink-0"
            disabled={locating}
            onClick={capturarUbicacion}
            startIcon={<MyLocationRoundedIcon />}
          >
            Usar mi ubicación
          </Button>
        </div>
      </div>

      <span className="flex items-center gap-1.5 text-label-sm text-text-secondary">
        <InfoOutlinedIcon fontSize="inherit" className="text-secondary" />
        Tocá el mapa o arrastrá el pin para ajustar la ubicación exacta de la
        residencia.
      </span>
    </div>
  )
}
