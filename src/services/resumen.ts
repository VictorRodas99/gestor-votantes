import { HTTPError } from 'ky'
import { RESUMEN_ROUTES } from '../constants/routes'
import api from '../lib/http'
import type { ResumenCampana, ResumenCampanaRaw } from '../types/resumen'

const aNumero = (valor: number | string | undefined): number => {
  const parsed = Number(valor)
  return !Number.isNaN(parsed) ? parsed : 0
}

function mapResumen(raw: ResumenCampanaRaw): ResumenCampana {
  return {
    cargados: aNumero(raw.cargados),
    visitados: aNumero(raw.visitados),
    votoSeguro: aNumero(raw.voto_seguro),
    afiliados: aNumero(raw.afiliados)
  }
}

export const getResumenCampana = async (): Promise<ResumenCampana> => {
  try {
    const raw = await api.get(RESUMEN_ROUTES.info).json<ResumenCampanaRaw>()

    return mapResumen(raw)
  } catch (reason) {
    if (reason instanceof HTTPError) {
      throw new Error(reason.message, { cause: reason })
    }

    throw new Error('No pudimos cargar el resumen de la campaña.', {
      cause: reason
    })
  }
}
