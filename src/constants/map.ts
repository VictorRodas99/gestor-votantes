// por defecto son las coords de pilar
const CIUDAD_COORDS_CENTER_LAT = Number(
  import.meta.env.VITE_CIUDAD_COORDS_CENTER_LAT ?? -26.8628
)
const CIUDAD_COORDS_CENTER_LNG = Number(
  import.meta.env.VITE_CIUDAD_COORDS_CENTER_LNG ?? -58.2939
)

export const CIUDAD_COORDS_CENTER: [number, number] = [
  CIUDAD_COORDS_CENTER_LAT,
  CIUDAD_COORDS_CENTER_LNG
]

export const MAP_DEFAULT_ZOOM = 15
export const MAP_FOCUS_ZOOM = 17

// ~6 km alrededor del centro. Se deriva de CIUDAD_COORDS_CENTER (configurable
// por env) para que la búsqueda acompañe si la app se usa en otra ciudad.
const VIEWBOX_DELTA_GRADOS = 0.055

export const CIUDAD_VIEWBOX = {
  lonMin: CIUDAD_COORDS_CENTER_LNG - VIEWBOX_DELTA_GRADOS,
  latMin: CIUDAD_COORDS_CENTER_LAT - VIEWBOX_DELTA_GRADOS,
  lonMax: CIUDAD_COORDS_CENTER_LNG + VIEWBOX_DELTA_GRADOS,
  latMax: CIUDAD_COORDS_CENTER_LAT + VIEWBOX_DELTA_GRADOS
}
