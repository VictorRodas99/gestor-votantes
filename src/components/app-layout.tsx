import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from './bottom-nav'
import LoadingState from './loading-state'
import TopBar from './top-bar'

/**
 * Layout persistente: la barra superior y la inferior se montan una sola vez y
 * el contenido de cada ruta entra por el `<Outlet>`. El `pb-bottom-nav` deja
 * espacio para la barra inferior fija (token en index.css, no número mágico).
 */
function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background-default">
      <TopBar />
      <main className="flex-1 px-5 pt-5 pb-bottom-nav">
        <Suspense fallback={<LoadingState />}>
          <Outlet />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  )
}

export default AppLayout
