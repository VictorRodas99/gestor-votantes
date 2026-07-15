import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import Button from '@mui/material/Button'

type ErrorStateProps = {
  title?: string
  description?: string
  /** Si se provee, muestra un botón "Reintentar". */
  onRetry?: () => void
}

/** Estado de error: mensaje claro + opción de reintentar (diseño: mobile.md §8). */
function ErrorState({
  title = 'Algo salió mal',
  description = 'No pudimos cargar esta pantalla.',
  onRetry
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 py-16 text-center"
    >
      <p className="text-body-lg font-semibold text-text-primary">{title}</p>
      {description ? (
        <p className="text-body-md text-text-secondary">{description}</p>
      ) : null}
      {onRetry ? (
        <Button
          variant="outlined"
          startIcon={<RefreshRoundedIcon />}
          onClick={onRetry}
        >
          Reintentar
        </Button>
      ) : null}
    </div>
  )
}

export default ErrorState
