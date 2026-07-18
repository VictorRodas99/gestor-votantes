import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import { Link, useLocation } from 'react-router-dom'
import { bottomNavItems, resolveActiveKey } from '../config/modules'

/**
 * Navegación inferior fija (mobile/tablet). Deriva de `bottomNavItems` (Inicio +
 * módulos con `inBottomNav`). El ítem activo se resuelve por la URL. En desktop
 * (`lg`) se oculta: la navegación pasa al `Sidebar`.
 */
function BottomNav() {
  const { pathname } = useLocation()
  const activeKey = resolveActiveKey(pathname, bottomNavItems)

  return (
    <BottomNavigation
      component="nav"
      aria-label="Navegación principal"
      showLabels
      value={activeKey}
      className="fixed inset-x-0 bottom-0 z-10 h-auto border-t border-divider bg-background-default py-4 lg:hidden"
    >
      {bottomNavItems.map((item) => (
        <BottomNavigationAction
          key={item.key}
          value={item.key}
          label={item.label}
          component={Link}
          to={item.path}
          icon={<item.Icon className="size-7" />}
        />
      ))}
    </BottomNavigation>
  )
}

export default BottomNav
