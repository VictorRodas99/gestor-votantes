import type { DefaultValues } from 'react-hook-form'
import { parsearDireccion } from '../../lib/direccion'
import type { Votante } from '../../types/votante'
import type { WizardFormData } from './wizard.schema'

/**
 * Traduce un votante del padrón (dominio) a los campos del wizard.
 *
 * Devuelve solo lo que aporta el padrón; el resto lo completa
 * `votanteWizardFormDefaults` al hacer `reset`. Se hidratan TODOS los campos
 * del POST (no solo los del Paso 1) porque el update de la API pisa con `0`/`''`
 * lo que no se reenvíe (notes/api/escritura-votaciones.md §4 W5): un prefill
 * parcial le borraría al votante los datos del padrón que el wizard no toca.
 */
export function votanteAValoresWizard(
  votante: Votante
): DefaultValues<WizardFormData> {
  return {
    cedula: votante.cedula,
    apellido: votante.apellido,
    nombre: votante.nombre,
    fecha_nacimiento: votante.fechaNacimiento,
    sexo: votante.sexo === 'F' ? 'F' : 'M',
    nacionalidad: votante.nacionalidad,
    celular: votante.celular || '',
    direccion: parsearDireccion(votante.direccion || ''),
    barrio_id: votante.barrioId || undefined,
    referente_id: votante.referenteId || undefined,

    local_votacion_id: votante.localVotacionId || undefined,
    boleta: votante.boleta || undefined,
    talon: votante.talon || undefined,
    mesa: votante.mesa || undefined,
    orden: votante.orden || undefined,
    hora_votacion: votante.horaVotacion,

    afiliacion: votante.afiliado,
    voto_seguro: votante.votoSeguro,
    voto_intendente: votante.votoIntendente,
    voto_intendente_anr: votante.votoIntendenteAnr,
    voto_intendente_alianza: votante.votoIntendenteAlianza,
    voto_concejal: votante.votoConcejal,
    movil: votante.requiereTransporte,
    visitado: votante.visitado,
    volver_visitar: votante.volverVisitar,

    encargado_visita: votante.encargadoVisita ?? '',
    tipo_visita: votante.tipoVisita ?? '',
    fecha_visita: votante.fechaVisita ?? '',
    observacion: votante.observacion,
    familiar: votante.familiar,
    nombre_familiar: votante.nombreFamiliar ?? '',
    inc: votante.inc,
    valor_inc: votante.valorInc || undefined
  }
}
