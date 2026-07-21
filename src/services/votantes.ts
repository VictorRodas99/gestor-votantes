import { HTTPError } from 'ky'
import { VOTANTES_PER_PAGE } from '../constants/config'
import { VOTANTE_ROUTES } from '../constants/routes'
import type { ReferenteFormData } from '../forms/votante/referente.schema'
import type { WizardFormData } from '../forms/votante/wizard.schema'
import { calcularEdad } from '../lib/date'
import { toTitleCase } from '../lib/format'
import api from '../lib/http'
import type { PaginatedResponse } from '../types/api'
import type { Votante, VotanteRaw } from '../types/votante'

/** Convierte `"1"` / `"0"` (y afines) al booleano de dominio. */
function toBoolean(value: string): boolean {
  return value === '1'
}

/**
 * Numérico que puede no estar cargado: la API devuelve `""` (o `null`) y
 * `Number('')` daría `0`, indistinguible de un valor real.
 */
function toNumeroOpcional(value: string | null): number | null {
  if (value === null || value.trim() === '') return null
  const numero = Number(value)
  return Number.isNaN(numero) ? null : numero
}

/** Castea un registro crudo (todo string) al modelo de dominio ya tipado. */
function mapVotante(raw: VotanteRaw): Votante {
  const nombre = toTitleCase(raw.nombre)
  const apellido = toTitleCase(raw.apellido)

  return {
    id: Number(raw.id),
    cedula: raw.cedula,
    apellido,
    nombre,
    celular: raw.celular.trim(),
    nombreCompleto: `${nombre} ${apellido}`.trim(),
    afiliado: toBoolean(raw.afiliacion),
    votoSeguro: toBoolean(raw.voto_seguro),
    requiereTransporte: toBoolean(raw.movil),
    localVotacionId: Number(raw.local_votacion_id),
    boleta: toNumeroOpcional(raw.boleta),
    talon: toNumeroOpcional(raw.talon),
    mesa: Number(raw.mesa),
    orden: Number(raw.orden),
    fechaNacimiento: raw.fecha_nacimiento,
    sexo: raw.sexo,
    nacionalidad: raw.nacionalidad,
    direccion: raw.direccion.trim(),
    encargadoVisita: raw.encargado_visita,
    tipoVisita: raw.tipo_visita,
    observacion: raw.observacion.trim()
  }
}

/**
 * Filtros del listado.
 *
 * Server-side REALES hoy (notes/api/documentation.md §5.2): `cedula` (exacta),
 * `apellido`/`nombre` (LIKE) y `localVotacionId` (FK exacta).
 *
 * `votoSeguro` / `afiliacion` / `movil` la API los IGNORA hoy; se envían
 * igual (el server los honrará cuando el proveedor los habilite). Ver
 * `pendientes-server.md` §1.
 */
export type VotantesFilters = {
  cedula?: string
  apellido?: string
  nombre?: string
  localVotacionId?: number
  votoSeguro?: boolean
  afiliacion?: boolean
  movil?: boolean
  page?: number
  perPage?: number
}

export type VotantesResult = {
  votantes: Votante[]
  total: number
  page: number
}

export const getVotantes = async (
  filters: VotantesFilters = {}
): Promise<VotantesResult> => {
  const {
    cedula,
    apellido,
    nombre,
    localVotacionId,
    votoSeguro,
    afiliacion,
    movil,
    page = 1,
    perPage = VOTANTES_PER_PAGE
  } = filters

  const searchParams: Record<string, string | number> = {
    page,
    per_page: perPage
  }
  if (cedula) searchParams.cedula = cedula
  if (apellido) searchParams.apellido = apellido
  if (nombre) searchParams.nombre = nombre
  if (localVotacionId != null) searchParams.local_votacion_id = localVotacionId

  // el server ignora hoy esto
  if (votoSeguro != null) searchParams.voto_seguro = votoSeguro ? 1 : 0
  if (afiliacion) searchParams.afiliacion = 1
  if (movil) searchParams.movil = 1

  try {
    const response = await api
      .get(VOTANTE_ROUTES.index, { searchParams })
      .json<PaginatedResponse<VotanteRaw>>()

    return {
      votantes: response.data.map(mapVotante),
      total: Number(response.total_items) || 0,
      page: Number(response.page) || page
    }
  } catch (reason) {
    // Esta API responde 200 + texto plano ante errores → `.json()` lanza un
    // SyntaxError, no un HTTPError. Unificamos todo en un Error legible.
    if (reason instanceof HTTPError) {
      throw new Error(reason.message, { cause: reason })
    }

    throw new Error('No pudimos cargar los votantes. Intentá de nuevo.', {
      cause: reason
    })
  }
}

/**
 * Trae un votante puntual por cédula.
 * Devuelve `null` si no existe.
 */
export const getVotanteByCedula = async (
  cedula: string
): Promise<Votante | null> => {
  const { votantes } = await getVotantes({ cedula, perPage: 1 })
  return votantes[0] ?? null
}

export type VotantePayload = {
  cedula: string
  apellido: string
  nombre: string
  fecha_nacimiento: string
  edad: number
  sexo: string
  celular: string
  direccion: { calle: string; lat: number | null; lng: number | null }
  barrio_id: number
  referente_id: number
  local_votacion_id: number
  boleta: number | null
  talon: number | null
  mesa: number | null
  orden: number | null
  afiliacion: boolean
  voto_seguro: boolean
  voto_intendente: boolean
  voto_concejal: boolean
  movil: boolean
  encargado_visita: string | null
  tipo_visita: string | null
  observacion: string
  familiar: boolean
  inc: boolean
  valor_inc: number
  nuevo_referente: (ReferenteFormData & { barrio_id: number }) | null
}

export function toVotantePayload(data: WizardFormData): VotantePayload {
  return {
    cedula: data.cedula,
    apellido: data.apellido,
    nombre: data.nombre,
    fecha_nacimiento: data.fecha_nacimiento,
    edad: calcularEdad(data.fecha_nacimiento),
    sexo: data.sexo,
    celular: data.celular ?? '',
    direccion: {
      calle: data.direccion?.calle ?? '',
      lat: data.direccion?.lat ?? null,
      lng: data.direccion?.lng ?? null
    },
    barrio_id: data.barrio_id ?? 0,
    referente_id: data.referente_id ?? 0,
    local_votacion_id: data.local_votacion_id,
    boleta: data.boleta ?? null,
    talon: data.talon ?? null,
    mesa: data.mesa ?? null,
    orden: data.orden ?? null,
    afiliacion: data.afiliacion,
    voto_seguro: data.voto_seguro,
    voto_intendente: data.voto_intendente,
    voto_concejal: data.voto_concejal,
    movil: data.movil,
    encargado_visita: data.encargado_visita || null,
    tipo_visita: data.tipo_visita || null,
    observacion: data.observacion ?? '',
    familiar: data.familiar,
    inc: data.inc,
    valor_inc: data.inc ? (data.valor_inc ?? 0) : 0,
    nuevo_referente: data.nuevo_referente
      ? { ...data.nuevo_referente, barrio_id: data.barrio_id ?? 0 }
      : null
  }
}

/**
 * todavía no se sabe el shape del response de la api después de hacer post
 * por eso el unknown como tipo
 */
export const crearVotante = async (data: WizardFormData): Promise<unknown> => {
  let raw: string

  try {
    raw = await api
      .post(VOTANTE_ROUTES.index, { json: toVotantePayload(data) })
      .text()
  } catch (reason) {
    if (reason instanceof HTTPError) {
      throw new Error(reason.message, { cause: reason })
    }

    throw new Error('No pudimos guardar el votante. Intentá de nuevo.', {
      cause: reason
    })
  }

  try {
    return JSON.parse(raw)
  } catch (reason) {
    throw new Error(
      raw.trim() || 'No pudimos guardar el votante. Intentá de nuevo.',
      { cause: reason }
    )
  }
}
