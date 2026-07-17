import { CATALOGO_ROUTES } from '../constants/routes'
import api from '../lib/http'
import type { PaginatedResponse } from '../types/api'
import type { CatalogoItem, CatalogoRaw } from '../types/catalogo'

// Servicios de catálogos (locales de votación, etc.). Son diminutos, así que se
// piden completos de una (per_page alto) y no se paginan (documentation.md §3).

const CATALOGO_PER_PAGE = 1000

function mapCatalogo(raw: CatalogoRaw): CatalogoItem {
  return { id: Number(raw.id), denominacion: raw.denominacion }
}

export const getLocalesVotacion = async (): Promise<CatalogoItem[]> => {
  try {
    const response = await api
      .get(CATALOGO_ROUTES.localVotacion, {
        searchParams: { per_page: CATALOGO_PER_PAGE }
      })
      .json<PaginatedResponse<CatalogoRaw>>()

    return response.data.map(mapCatalogo)
  } catch {
    throw new Error('No pudimos cargar los locales de votación.')
  }
}

export const getBarrios = async (): Promise<CatalogoItem[]> => {
  try {
    const response = await api
      .get(CATALOGO_ROUTES.barrios, {
        searchParams: { per_page: CATALOGO_PER_PAGE }
      })
      .json<PaginatedResponse<CatalogoRaw>>()

    return response.data.map(mapCatalogo)
  } catch {
    return []
  }
}

export const getSectores = async (): Promise<CatalogoItem[]> => {
  try {
    const response = await api
      .get(CATALOGO_ROUTES.sectores, {
        searchParams: { per_page: CATALOGO_PER_PAGE }
      })
      .json<PaginatedResponse<CatalogoRaw>>()

    return response.data.map(mapCatalogo)
  } catch {
    return []
  }
}
