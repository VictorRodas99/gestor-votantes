import HowToVoteRoundedIcon from '@mui/icons-material/HowToVoteRounded'
import { Link, useLocation } from 'react-router-dom'
import { resolveActiveKey, sidebarNavItems } from '../config/modules'
import { APP_NAME } from '../constants/app'

function Sidebar() {
  const { pathname } = useLocation()
  const activeKey = resolveActiveKey(pathname, sidebarNavItems)

  return (
    <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-divider bg-background-default lg:flex">
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="flex size-10 items-center justify-center rounded-md bg-surface-container text-primary">
          <HowToVoteRoundedIcon className="size-6" />
        </span>
        <span className="text-headline-md font-semibold tracking-wide text-primary">
          {APP_NAME}
        </span>
      </div>

      <nav
        aria-label="Navegación principal"
        className="flex flex-col gap-1 px-3"
      >
        {sidebarNavItems.map((item) => {
          const isActive = item.key === activeKey
          const className = isActive
            ? 'flex items-center gap-3 rounded-md bg-primary-container px-4 py-3 font-semibold text-primary-contrast'
            : 'flex items-center gap-3 rounded-md px-4 py-3 font-medium text-text-secondary hover:bg-surface-container'
          const contenido = (
            <>
              <item.Icon className="size-6" />
              {item.label}
            </>
          )

          return 'externo' in item && item.externo ? (
            <a key={item.key} href={item.path} className={className}>
              {contenido}
            </a>
          ) : (
            <Link
              key={item.key}
              to={item.path}
              aria-current={isActive ? 'page' : undefined}
              className={className}
            >
              {contenido}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
