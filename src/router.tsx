import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './components/app-layout'
import RouteError from './components/route-error'
import { modules } from './config/modules'
import { ROUTER_BASENAME } from './constants/config'
import HomePage from './pages/home'
import NotFound from './pages/not-found'

const lazyPages = {
  votanteWizard: lazy(() => import('./pages/votante-wizard'))
}

export const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      errorElement: <RouteError />,
      children: [
        { index: true, element: <HomePage /> },
        ...modules.map((module) => ({
          path: module.path.slice(1),
          element: <module.Component />
        })),
        { path: 'votantes/nuevo', element: <lazyPages.votanteWizard /> },
        { path: '*', element: <NotFound /> }
      ]
    }
  ],
  {
    basename: ROUTER_BASENAME
  }
)
