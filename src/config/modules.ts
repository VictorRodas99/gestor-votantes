import type { SvgIconComponent } from '@mui/icons-material'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import InsertChartRoundedIcon from '@mui/icons-material/InsertChartRounded'

export type AppModule = {
  key: string
  label: string
  path: string
  Icon: SvgIconComponent
  /** Si el módulo aparece como acceso directo en la navegación inferior. */
  inBottomNav: boolean
}

export const modules: AppModule[] = [
  {
    key: 'votantes',
    label: 'Votantes',
    path: '/votantes',
    Icon: GroupsRoundedIcon,
    inBottomNav: true
  },
  {
    key: 'asignacion',
    label: 'Asignación',
    path: '/asignacion',
    Icon: AssignmentRoundedIcon,
    inBottomNav: true
  },
  {
    key: 'reportes',
    label: 'Reportes',
    path: '/reportes',
    Icon: InsertChartRoundedIcon,
    inBottomNav: true
  },
  {
    key: 'catalogos',
    label: 'Catálogos',
    path: '/catalogos',
    Icon: CategoryRoundedIcon,
    inBottomNav: false
  }
]

export const homeNavItem = {
  key: 'inicio',
  label: 'Inicio',
  path: '/',
  Icon: HomeRoundedIcon
} satisfies Omit<AppModule, 'inBottomNav'>

export const bottomNavItems = [
  homeNavItem,
  ...modules.filter((module) => module.inBottomNav)
]
