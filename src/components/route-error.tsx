import { useRouteError } from 'react-router-dom'
import ErrorState from './error-state'

/**
 * `errorElement` del router. Reemplaza toda la pantalla (incluida la barra
 * superior/inferior), por eso ocupa el alto completo. Ofrece recargar.
 */
function RouteError() {
  const error = useRouteError()
  const description =
    error instanceof Error ? error.message : 'No pudimos cargar esta pantalla.'

  return (
    <div className="flex min-h-svh flex-col justify-center bg-background-default px-5">
      <ErrorState
        description={description}
        onRetry={() => window.location.reload()}
      />
    </div>
  )
}

export default RouteError
