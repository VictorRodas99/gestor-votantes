type WizardProgressProps = {
  /** Índice del paso actual (0-based). */
  current: number
  total: number
  /** Título del paso actual (ej. "Votación"). */
  title: string
}

/**
 * Indicador de progreso segmentado (un tramo por paso), como
 * `notes/design/images/wizard/paso-dos.png`: tramos llenos hasta el paso actual
 * y texto "Paso X de N: Título" alineado a la derecha.
 */
export default function WizardProgress({
  current,
  total,
  title
}: WizardProgressProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full ${
              index <= current ? 'bg-primary' : 'bg-surface-dim'
            }`}
          />
        ))}
      </div>
      <span className="text-right text-label-md font-semibold text-text-secondary">
        Paso {current + 1} de {total}: {title}
      </span>
    </div>
  )
}
