import type { ColumnaExcel } from '../lib/exportar-excel'
import type { Votante } from '../types/votante'

export type ContextoExport = {
  /** `local_votacion_id` → denominación (catálogo ya cacheado). */
  locales: Map<number, string>
}

const siNo = (valor: boolean) => (valor ? 'Sí' : 'No')

export const COLUMNAS_VOTANTE: ColumnaExcel<Votante, ContextoExport>[] = [
  { header: 'Apellido', width: 22, valor: (v) => v.apellido },
  { header: 'Nombre', width: 22, valor: (v) => v.nombre },
  {
    header: 'CI',
    width: 12,
    format: '#,##0',
    valor: (v) => Number(v.cedula) || null
  },
  { header: 'Celular', width: 14, valor: (v) => v.celular || null },
  {
    header: 'Local de votación',
    width: 30,
    valor: (v, ctx) => ctx.locales.get(v.localVotacionId) ?? null
  },
  // `0` en mesa/orden es "no cargado en el padrón", no un dato.
  { header: 'Mesa', width: 8, valor: (v) => v.mesa || null },
  { header: 'Orden', width: 8, valor: (v) => v.orden || null },
  { header: 'Voto seguro', width: 12, valor: (v) => siNo(v.votoSeguro) },
  { header: 'Afiliado', width: 10, valor: (v) => siNo(v.afiliado) },
  { header: 'Transporte', width: 12, valor: (v) => siNo(v.requiereTransporte) },
  { header: 'Visitado', width: 10, valor: (v) => siNo(v.visitado) },
  { header: 'Observación', width: 40, valor: (v) => v.observacion || null }

  // { header: 'Dirección', width: 32, valor: (v) => v.direccion || null },
  // { header: 'Fecha de visita', width: 14, valor: (v) => v.fechaVisita },
  // { header: 'Volver a visitar', width: 14, valor: (v) => siNo(v.volverVisitar) },
  // La de Referente además pide sumar `referentes: Map<number, string>` a
  // ContextoExport y traer el catálogo en el hook:
  // { header: 'Referente', width: 26, valor: (v, ctx) => ctx.referentes.get(v.referenteId) ?? null }
]

export const NOMBRE_HOJA = 'Votantes'

/** ej `votantes-2026-08-05.xlsx` */
export const nombreArchivoVotantes = () =>
  `votantes-${new Date().toISOString().slice(0, 10)}.xlsx`
