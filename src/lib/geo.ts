type Punto = { lat: number; lng: number }

/**
 * Distancia aproximada entre dos puntos, en unidades arbitrarias comparables
 * (proyección equirectangular, sin la raíz cuadrada).
 *
 * **Solo sirve para ordenar**, nunca para mostrarle un número al usuario. Se
 * usa a distancias de pocos km alrededor de `CIUDAD_COORDS_CENTER`, donde el
 * orden que produce es idéntico al de una haversine real. Va a mano y no por
 * librería a propósito: `L.latLng().distanceTo()` de Leaflet sería lo correcto,
 * pero Leaflet solo entra por `lazy()` (chunk del mapa) e importarlo acá lo
 * arrastraría al bundle principal.
 */
export function distanciaAprox(a: Punto, b: Punto): number {
  const latMedia = ((a.lat + b.lat) / 2) * (Math.PI / 180)
  // Los meridianos se juntan al alejarse del ecuador: sin este factor, un grado
  // de longitud pesaría lo mismo que uno de latitud y el orden saldría sesgado.
  const dx = (a.lng - b.lng) * Math.cos(latMedia)
  const dy = a.lat - b.lat
  return dx * dx + dy * dy
}
