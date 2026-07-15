import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  /** Acción sugerida (ej. un botón "Agregar"). */
  action?: ReactNode
}

/** Estado vacío: mensaje amable + acción sugerida (diseño: mobile.md §8). */
function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <p className="text-body-lg font-semibold text-text-primary">{title}</p>
      {description ? (
        <p className="text-body-md text-text-secondary">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}

export default EmptyState
