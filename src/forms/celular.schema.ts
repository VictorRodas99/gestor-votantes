import { z } from 'zod'
import { esCelularValido } from '../lib/telefono'

const MENSAJE_INVALIDO = 'Número de celular inválido'

/** Celular obligatorio (referente / puntero). */
export const celularSchema = z
  .string()
  .trim()
  .min(1, 'El celular es obligatorio')
  .refine(esCelularValido, MENSAJE_INVALIDO)

/**
 * Celular opcional (votante): vacío es válido, pero si hay algo cargado tiene
 * que ser un móvil paraguayo real.
 */
export const celularOpcionalSchema = z
  .string()
  .trim()
  .refine((valor) => valor === '' || esCelularValido(valor), MENSAJE_INVALIDO)
