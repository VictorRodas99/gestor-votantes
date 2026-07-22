import { REFERENTE_ROUTES } from '../constants/routes'
import { toTitleCase } from '../lib/format'
import api from '../lib/http'
import type { PaginatedResponse } from '../types/api'
import type { Referente, ReferenteRaw } from '../types/referente'

const REFERENTES_PER_PAGE = 50

function mapReferente(raw: ReferenteRaw): Referente {
  return {
    id: Number(raw.id),
    nombreApellido: toTitleCase(raw.nombre_apellido),
    cedula: raw.cedula,
    celular: raw.celular?.trim() ?? '',
    afiliacion: raw.afiliacion === '1',
    barrioId: Number(raw.barrio_id),
    sectorId: Number(raw.sector_id)
  }
}

export const getReferentes = async (search = ''): Promise<Referente[]> => {
  const searchParams: Record<string, string | number> = {
    per_page: REFERENTES_PER_PAGE
  }
  if (search) searchParams.nombre_apellido = search

  try {
    const response = await api
      .get(REFERENTE_ROUTES.index, { searchParams })
      .json<PaginatedResponse<ReferenteRaw>>()

    return response.data.map(mapReferente)
  } catch {
    return []
  }
}

export const getReferentePorId = async (
  id: number
): Promise<Referente | null> => {
  try {
    const response = await api
      .get(REFERENTE_ROUTES.index, { searchParams: { id, per_page: 1 } })
      .json<PaginatedResponse<ReferenteRaw>>()

    const raw = response.data[0]
    return raw ? mapReferente(raw) : null
  } catch {
    return null
  }
}
