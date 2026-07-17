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
