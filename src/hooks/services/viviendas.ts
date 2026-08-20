import { useMutation } from '@tanstack/react-query'
import { crearVivienda } from '../../services/viviendas'

// No hay listado de viviendas todavía, así que no hay query que invalidar
export const useCrearVivienda = () => useMutation({ mutationFn: crearVivienda })
