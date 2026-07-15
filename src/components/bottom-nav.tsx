import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import { bottomNavItems } from '../config/modules'

function BottomNav() {
  return (
    <BottomNavigation
      showLabels
      value={false}
      className="fixed inset-x-0 bottom-0 z-10 h-auto border-t border-divider bg-background-default py-4"
    >
      {bottomNavItems.map((item) => (
        <BottomNavigationAction
          key={item.key}
          value={item.key}
          label={item.label}
          icon={<item.Icon className="size-7" />}
        />
      ))}
    </BottomNavigation>
  )
}

export default BottomNav
