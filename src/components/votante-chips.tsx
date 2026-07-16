import type { Votante } from '../types/votante'

// Chips del "estado de compromiso" del votante.

type Chip = {
  key: string
  label: string
  className: string
}

/**
 * Estado de voto: mutuamente excluyente, siempre hay uno.
 * `votoSeguro` → verde "Voto seguro"; si no → ámbar "Indeciso".
 * Más los chips independientes: "Afiliado" (azul) y "Requiere transporte" (gris).
 */
function getChips(votante: Votante): Chip[] {
  const chips: Chip[] = [
    votante.votoSeguro
      ? {
          key: 'voto',
          label: 'Voto seguro',
          className: 'bg-success/10 text-success-dark'
        }
      : {
          key: 'voto',
          label: 'Indeciso',
          className: 'bg-warning/15 text-warning-dark'
        }
  ]

  if (votante.afiliado) {
    chips.push({
      key: 'afiliado',
      label: 'Afiliado',
      className: 'bg-primary/10 text-primary'
    })
  }

  if (votante.requiereTransporte) {
    chips.push({
      key: 'transporte',
      label: 'Requiere transporte',
      className: 'bg-surface-container-high text-text-secondary'
    })
  }

  return chips
}

function VotanteChips({ votante }: { votante: Votante }) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-2">
      {getChips(votante).map((chip) => (
        <span
          key={chip.key}
          className={`rounded-full px-3 py-1 text-label-md font-medium ${chip.className}`}
        >
          {chip.label}
        </span>
      ))}
    </div>
  )
}

export default VotanteChips
