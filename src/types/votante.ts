// Tipos del recurso Votante.
//
// Dos capas (notes/api/documentation.md §5.1):
//   1. `VotanteRaw`   → cómo viene de la API: TODO string, `null` en algunos campos.
//   2. `Votante`      → modelo de dominio ya casteado que consume la UI.

/** Registro tal cual lo devuelve la API `/votantes` (todos los campos son string). */
export type VotanteRaw = {
  id: string
  codigo: string
  cedula: string
  apellido: string
  nombre: string
  afiliacion: string
  direccion: string
  mapa: string
  celular: string
  familiar: string
  observacion: string
  fecha_nacimiento: string
  edad: string
  sexo: string
  nacionalidad: string
  local_votacion_id: string
  boleta: string
  talon: string
  mesa: string
  orden: string
  hora_votacion: string
  movil: string
  voto_seguro: string
  voto_concejal: string
  voto_intendente: string
  inc: string
  valor_inc: string
  encargado_visita: string | null
  tipo_visita: string | null
  /** Vínculo votante↔referente (FK 1:N). `"0"` = sin asignar. */
  referente_id: string
  visitado: string
}

/** Modelo de dominio: solo los campos que hoy usa el listado, ya casteados. */
export type Votante = {
  id: number
  cedula: string
  apellido: string
  nombre: string
  celular: string
  /** Nombre completo "Nombre Apellido" para mostrar. */
  nombreCompleto: string
  /** Estado de compromiso (notes/conceptos.md "estado de compromiso"). */
  afiliado: boolean
  votoSeguro: boolean
  /** `movil` = necesita transporte para ir a votar el Día D. */
  requiereTransporte: boolean
  votoIntendente: boolean
  votoConcejal: boolean
  visitado: boolean
  localVotacionId: number
  /** `null` cuando no está cargado en el padrón (opcionales en el alta). */
  boleta: number | null
  talon: number | null
  mesa: number
  orden: number
  // Identidad para el prefill del wizard (enriquecimiento por cédula).
  /** `YYYY-MM-DD` del padrón. */
  fechaNacimiento: string
  /** `'M'` / `'F'` del padrón. */
  sexo: string
  nacionalidad: string
  // Campos que hoy solo consume el detalle (no el listado).
  direccion: string
  encargadoVisita: string | null
  tipoVisita: string | null
  observacion: string
  familiar: boolean
  inc: boolean
  valorInc: number
  /** `0` = sin referente asignado. */
  referenteId: number
}
