import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Fragment } from 'react'

type WizardProgressProps = {
  /** Índice del paso actual (0-based). */
  current: number
  total: number
  title: string
  /** Labels cortos de todos los pasos, para el stepper de desktop. */
  steps: string[]
}

export default function WizardProgress({
  current,
  total,
  title,
  steps
}: WizardProgressProps) {
  return (
    <>
      {/* Mobile / tablet */}
      <div className="flex flex-col gap-2 lg:hidden">
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

      {/* Desktop */}
      <div className="hidden items-center lg:flex">
        {steps.map((label, index) => {
          const completado = index < current
          const activo = index === current
          const marcado = completado || activo
          return (
            <Fragment key={label}>
              {index > 0 && (
                <span
                  className={`mx-3 h-px flex-1 ${
                    index <= current ? 'bg-primary' : 'bg-divider'
                  }`}
                />
              )}
              <div
                className={`flex items-center gap-2 px-5 pb-3 ${
                  activo ? 'border-b-3 border-primary' : ''
                }`}
              >
                <span
                  className={`flex size-7 items-center justify-center rounded-full text-label-md font-semibold ${
                    marcado
                      ? 'bg-primary text-primary-contrast'
                      : 'bg-surface-container text-text-secondary'
                  }`}
                >
                  {completado ? (
                    <CheckRoundedIcon fontSize="small" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={`text-body-md uppercase ${
                    activo
                      ? 'font-semibold text-text-primary'
                      : 'text-text-secondary'
                  }`}
                >
                  {label}
                </span>
              </div>
            </Fragment>
          )
        })}
      </div>
    </>
  )
}
