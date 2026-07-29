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
  nombre_familiar: string | null
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
  voto_intendente_anr: string | null
  voto_intendente_alianza: string | null
  inc: string
  valor_inc: string
  encargado_visita: string | null
  fecha_visita: string | null
  tipo_visita: string | null
  /** Vínculo votante↔referente (FK 1:N). `"0"` = sin asignar. */
  referente_id: string
  visitado: string
  volver_visitar: string | null
}

/** Modelo de dominio: solo los campos que hoy usa el listado, ya casteados. */
export type Votante = {
  id: number
  /** Identificador alfanumérico (13 hex) que el backend genera con `uniqid()`. */
  codigo: string
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
  /** Subcampos de `votoIntendente`: excluyentes entre sí. */
  votoIntendenteAnr: boolean
  votoIntendenteAlianza: boolean
  votoConcejal: boolean
  visitado: boolean
  volverVisitar: boolean
  localVotacionId: number
  /** `HH:MM` — la columna es `time` (`HH:MM:SS`); se recorta para el input. */
  horaVotacion: string
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
  /** `YYYY-MM-DD`; `null` si nunca se registró una visita. */
  fechaVisita: string | null
  tipoVisita: string | null
  observacion: string
  familiar: boolean
  /** `null` mientras `familiar` sea false o no se haya cargado. */
  nombreFamiliar: string | null
  inc: boolean
  valorInc: number
  /** `0` = sin referente asignado. */
  referenteId: number
}
