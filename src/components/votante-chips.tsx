import type { Votante } from '../types/votante'

// Chips del "estado de compromiso" del votante.

function Pill({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-label-md font-medium ${className}`}
    >
      {label}
    </span>
  )
}

/**
 * Estado de voto (mutuamente excluyente, siempre hay uno):
 * `votoSeguro` → verde "Voto seguro"; si no → ámbar "Indeciso".
 * Se usa suelto en la tabla del listado y dentro de `VotanteChips`.
 */
export function VotoEstadoChip({ votante }: { votante: Votante }) {
  return votante.votoSeguro ? (
    <Pill label="Voto seguro" className="bg-success/10 text-success-dark" />
  ) : (
    <Pill label="Indeciso" className="bg-warning/15 text-warning-dark" />
  )
}

/** Todos los chips de compromiso: voto + afiliado + transporte. */
function VotanteChips({ votante }: { votante: Votante }) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-2">
      <VotoEstadoChip votante={votante} />

      {votante.afiliado && (
        <Pill label="Afiliado" className="bg-primary/10 text-primary" />
      )}

      {votante.requiereTransporte && (
        <Pill
          label="Requiere transporte"
          className="bg-surface-container-high text-text-secondary"
        />
      )}
    </div>
  )
}

export default VotanteChips
