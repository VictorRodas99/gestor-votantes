import CircularProgress from '@mui/material/CircularProgress'

type LoadingStateProps = {
  label?: string
}

/** Estado de carga (spinner + texto). Usado como fallback de Suspense. */
function LoadingState({ label = 'Cargando…' }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-16 text-text-secondary"
    >
      <CircularProgress />
      <span className="text-body-md">{label}</span>
    </div>
  )
}

export default LoadingState
