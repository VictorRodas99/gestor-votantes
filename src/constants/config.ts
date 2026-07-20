export const API_URL: string =
  import.meta.env.VITE_API_URL ??
  'https://elecciones.appbinario.com/api/Eleccionesapi'

export const ROUTER_BASENAME: string =
  import.meta.env.VITE_ROUTER_BASENAME ?? '/'

export const VOTANTES_PER_PAGE = 20
