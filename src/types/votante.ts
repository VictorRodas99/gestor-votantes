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
  /** Anclaje de zona del votante. `null` en todo el padrón: solo lo puebla el wizard. */
  barrio_id: string | null
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
  /** Columna nullable (default `0`). */
  mercaderia: string | null
  inc: string
  valor_inc: string
  encargado_visita: string | null
  fecha_visita: string | null
  tipo_visita: string | null
  /** Vínculo votante↔referente (FK 1:N). `"0"` = sin asignar. */
  referente_id: string
  /**
   * `nombre_apellido` del referente, resuelto por subconsulta en el server.
   * `null` sin referente; ausente con un server previo a pendientes §24.
   */
  referente?: string | null
  /**
   * `nombre apellido` del **primer** usuario que tocó al votante (quien lo creó;
   * `MIN(id)` de la auditoría). `null` si nunca se editó desde la app.
   */
  creado_por?: string | null
  /**
   * `nombre apellido` del **último** usuario del sistema que modificó al votante
   * (`MAX(id)` de la auditoría). `null` si nunca se editó desde la app; ausente
   * con un server previo a pendientes §24.
   */
  modificado_por?: string | null
  /** "¿Ya pasó?" en la UI. */
  yavoto: string
  /** "¿Votó?" en la UI. */
  cobro: string
  /** Observación de la jornada; no confundir con `observacion` (la de la visita). */
  obs: string
  /** Contactado pero aún no visitado. Columna nueva NULLable → puede venir `null`. */
  contactado: string | null
  visitado: string
  volver_visitar: string | null
}

/** Modelo de dominio: solo los campos que hoy usa el listado, ya casteados. */
export type Votante = {
  id: number
  /**
   * Código **tal cual está persistido**: 8 dígitos en el formato vigente, un
   * `uniqid()` viejo, o `''` si nunca se guardó. El código que le corresponde
   * al votante se deriva de su cédula con `codigoDesdeCedula` (`lib/codigo.ts`).
   */
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
  /** Contactado pero aún no visitado (estado previo a `visitado`). */
  contactado: boolean
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
  /** `0` = sin barrio asignado. */
  barrioId: number
  encargadoVisita: string | null
  /** `YYYY-MM-DD`; `null` si nunca se registró una visita. */
  fechaVisita: string | null
  tipoVisita: string | null
  observacion: string
  familiar: boolean
  /** `null` mientras `familiar` sea false o no se haya cargado. */
  nombreFamiliar: string | null
  mercaderia: boolean
  inc: boolean
  valorInc: number
  /** `0` = sin referente asignado. */
  referenteId: number
  /** `''` = sin referente. */
  referenteNombre: string
  /**
   * Primer usuario que tocó al votante (quien lo creó). `''` = sin auditoría.
   */
  creadoPor: string
  /**
   * Último usuario que modificó al votante (auditoría). `''` = nunca editado
   * desde la app. Es lo que el listado muestra como "Referente".
   */
  modificadoPor: string
  /** "¿Ya pasó?" en la UI. */
  yaVoto: boolean
  /** "¿Votó?" en la UI; solo puede ser `true` si `yaVoto` lo es. */
  cobro: boolean
  obs: string
}
