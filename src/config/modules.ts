import type { SvgIconComponent } from '@mui/icons-material'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import InsertChartRoundedIcon from '@mui/icons-material/InsertChartRounded'
import type { ComponentType, LazyExoticComponent } from 'react'
import { lazy } from 'react'

export type AppModule = {
  key: string
  label: string
  path: string
  Icon: SvgIconComponent
  /** Si el módulo aparece como acceso directo en la navegación inferior. */
  inBottomNav: boolean
  /** Página del módulo, cargada de forma diferida (code-splitting por ruta). */
  Component: LazyExoticComponent<ComponentType>
}

export const modules: AppModule[] = [
  {
    key: 'votantes',
    label: 'Votantes',
    path: '/votantes',
    Icon: GroupsRoundedIcon,
    inBottomNav: true,
    Component: lazy(() => import('../pages/votantes'))
  },
  {
    key: 'asignacion',
    label: 'Asignación',
    path: '/asignacion',
    Icon: AssignmentRoundedIcon,
    inBottomNav: true,
    Component: lazy(() => import('../pages/asignacion'))
  },
  {
    key: 'reportes',
    label: 'Reportes',
    path: '/reportes',
    Icon: InsertChartRoundedIcon,
    inBottomNav: true,
    Component: lazy(() => import('../pages/reportes'))
  },
  {
    key: 'catalogos',
    label: 'Catálogos',
    path: '/catalogos',
    Icon: CategoryRoundedIcon,
    inBottomNav: false,
    Component: lazy(() => import('../pages/catalogos'))
  }
]

export const homeNavItem = {
  key: 'inicio',
  label: 'Inicio',
  path: '/',
  Icon: HomeRoundedIcon
} satisfies Pick<AppModule, 'key' | 'label' | 'path' | 'Icon'>

export const bottomNavItems = [
  homeNavItem,
  ...modules.filter((module) => module.inBottomNav)
]

/** Navegación del sidebar (desktop): Inicio + todos los módulos, incluido Catálogos. */
export const sidebarNavItems = [homeNavItem, ...modules]

type NavItem = Pick<AppModule, 'key' | 'path'>

/**
 * Resuelve qué ítem de navegación está activo según la URL. Inicio (`/`) solo
 * matchea de forma exacta; el resto por prefijo, así `/votantes/nuevo` mantiene
 * "Votantes" activo. Compartido por `BottomNav` y `Sidebar` para no divergir.
 */
export function resolveActiveKey(pathname: string, items: NavItem[]) {
  return (
    items.find((item) =>
      item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)
    )?.key ?? false
  )
}
