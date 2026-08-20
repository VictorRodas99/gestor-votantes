import 'leaflet/dist/leaflet.css'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import type L from 'leaflet'
import { lazy, Suspense, useEffect, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { toast } from 'sonner'
import { CIUDAD_COORDS_CENTER, MAP_DEFAULT_ZOOM } from '../../constants/map'
import { useUbicacionVivienda } from '../../hooks/use-ubicacion-vivienda'
import { ClickMarker, type LatLng, RecentrarMapa } from '../wizard/map-shared'

const MapPicker = lazy(() => import('../wizard/map-picker'))

export default function ViviendaUbicacionField({
  errorCoords
}: {
  errorCoords?: string
}) {
  const {
    lat,
    lng,
    tieneCoordenadas,
    locating,
    aplicarUbicacion,
    capturarUbicacion
  } = useUbicacionVivienda()
  const [map, setMap] = useState<L.Map | null>(null)
  const [expandido, setExpandido] = useState(false)

  const position: LatLng | null = lat != null && lng != null ? [lat, lng] : null

  useEffect(() => {
    if (!map) return
    const id = window.setTimeout(() => map.invalidateSize(), 150)
    return () => window.clearTimeout(id)
  }, [map])

  return (
    <div className="flex flex-col gap-2">
      <span className="text-label-md font-semibold text-text-primary">
        Ubicación
      </span>

      <div className="relative h-56 overflow-hidden rounded-lg border border-divider lg:h-[32rem]">
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
          <RecentrarMapa position={position} />
        </MapContainer>

        <div className="pointer-events-none absolute inset-x-3 top-3 z-1000 flex items-center justify-end gap-2">
          <span className="flex items-center gap-1 rounded-md bg-surface-container-lowest/95 px-3 py-1.5 text-label-sm font-medium text-text-secondary shadow-card">
            <PlaceRoundedIcon fontSize="inherit" className="text-primary" />
            {tieneCoordenadas
              ? `${lat!.toFixed(5)}, ${lng!.toFixed(5)}`
              : 'Sin ubicación'}
          </span>

          <div className="flex gap-2">
            {/* Expandir a pantalla completa: solo mobile/tablet. */}
            <IconButton
              onClick={() => setExpandido(true)}
              aria-label="Expandir el mapa"
              size="small"
              className="pointer-events-auto bg-surface-container-lowest/95 shadow-card lg:hidden"
            >
              <OpenInFullRoundedIcon fontSize="small" />
            </IconButton>
            {/* GPS como icon-button: solo desktop (en mobile va el botón de abajo). */}
            <IconButton
              onClick={capturarUbicacion}
              disabled={locating}
              aria-label="Usar mi ubicación actual"
              size="small"
              className="pointer-events-auto hidden bg-surface-container-lowest/95 shadow-card lg:inline-flex"
            >
              <MyLocationRoundedIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      </div>

      {/* GPS full-width: solo mobile/tablet. */}
      <Button
        variant="outlined"
        onClick={capturarUbicacion}
        disabled={locating}
        startIcon={<MyLocationRoundedIcon />}
        className="lg:hidden"
      >
        Usar mi ubicación actual
      </Button>

      <span className="hidden items-center gap-1.5 text-label-sm text-text-secondary lg:flex">
        <InfoOutlinedIcon fontSize="inherit" className="text-secondary" />
        Ajuste el pin para marcar la entrada principal de la vivienda.
      </span>

      {errorCoords && (
        <span className="text-label-sm text-error">{errorCoords}</span>
      )}

      {expandido && (
        <Suspense fallback={null}>
          <MapPicker
            open={expandido}
            lat={lat}
            lng={lng}
            onClose={() => setExpandido(false)}
            onConfirm={(nextLat, nextLng) => {
              aplicarUbicacion(nextLat, nextLng)
              setExpandido(false)
              toast.success('Ubicación seleccionada.')
            }}
          />
        </Suspense>
      )}
    </div>
  )
}
