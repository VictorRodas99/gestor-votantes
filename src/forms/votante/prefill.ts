import type { DefaultValues } from 'react-hook-form'
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
    direccion: { calle: votante.direccion || '' },
    referente_id: votante.referenteId || undefined,

    local_votacion_id: votante.localVotacionId || undefined,
    boleta: votante.boleta || undefined,
    talon: votante.talon || undefined,
    mesa: votante.mesa || undefined,
    orden: votante.orden || undefined,

    afiliacion: votante.afiliado,
    voto_seguro: votante.votoSeguro,
    voto_intendente: votante.votoIntendente,
    voto_concejal: votante.votoConcejal,
    movil: votante.requiereTransporte,
    visitado: votante.visitado,

    encargado_visita: votante.encargadoVisita ?? '',
    tipo_visita: votante.tipoVisita ?? '',
    observacion: votante.observacion,
    familiar: votante.familiar,
    inc: votante.inc,
    valor_inc: votante.valorInc || undefined
  }
}
