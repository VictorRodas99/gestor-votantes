import type { VotantesFilters } from '../services/votantes'

export type EstadoValue = 'voto-seguro' | 'indeciso' | 'afiliado' | 'transporte'

type EstadoOption = {
  value: EstadoValue
  label: string
  /** Filtros que aplica esta opción al elegirse. */
  filters: Pick<VotantesFilters, 'votoSeguro' | 'afiliacion' | 'movil'>
}

export const ESTADO_OPTIONS: EstadoOption[] = [
  { value: 'voto-seguro', label: 'Voto seguro', filters: { votoSeguro: true } },
  { value: 'indeciso', label: 'Indeciso', filters: { votoSeguro: false } },
  { value: 'afiliado', label: 'Afiliado', filters: { afiliacion: true } },
  {
    value: 'transporte',
    label: 'Requiere transporte',
    filters: { movil: true }
  }
]
