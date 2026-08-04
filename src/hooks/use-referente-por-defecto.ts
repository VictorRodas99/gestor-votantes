import { useEffect, useRef } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { WizardFormData } from '../forms/votante/wizard.schema'
import { useReferentePorUserId } from './services/referentes'
import { useUsuarioActual } from './services/sesion'

/**
 * Preselecciona el referente asociado al usuario logueado.
 */
export function useReferentePorDefecto(
  form: UseFormReturn<WizardFormData>,
  origen: 'nuevo' | 'padron'
) {
  const { data: usuario } = useUsuarioActual()
  const { data: referente } = useReferentePorUserId(usuario?.id)
  const debeAplicar = useRef(false)

  useEffect(() => {
    const { referente_id, nuevo_referente } = form.getValues()
    debeAplicar.current = referente_id == null && nuevo_referente == null
  }, [origen, form])

  // `origen` también acá: con la query ya cacheada, `referente` no cambia de identidad
  // durante el prefill del padrón y este efecto no volvería a correr, dejando la decisión
  // tomada pero sin ejecutar. React corre los efectos en orden de declaración, así que
  // `debeAplicar` ya está actualizado cuando se lee.
  useEffect(() => {
    if (!debeAplicar.current || !referente) return

    // re-chequeo por si el usuario eligió algo mientras la query cargaba: no pisar.
    const { referente_id, nuevo_referente } = form.getValues()
    if (referente_id != null || nuevo_referente != null) {
      debeAplicar.current = false
      return
    }

    form.setValue('referente_id', referente.id)
    // espejo de barrio
    if (referente.barrioId) form.setValue('barrio_id', referente.barrioId)
    debeAplicar.current = false
  }, [origen, referente, form])
}
