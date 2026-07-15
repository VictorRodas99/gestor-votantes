import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useLocation } from 'react-router-dom'
import { modules } from '../config/modules'
import { APP_NAME } from '../constants/app'

/**
 * Barra superior. El título se deriva de la ruta activa (etiqueta del módulo);
 * en Inicio muestra el nombre de la app.
 */
function TopBar() {
  const { pathname } = useLocation()
  const activeModule = modules.find((module) =>
    pathname.startsWith(module.path)
  )
  const title = activeModule?.label ?? APP_NAME

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      className="border-b border-divider bg-background-default"
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="h1"
          className="flex-1 text-center text-2xl font-semibold tracking-wide text-primary"
        >
          {title}
        </Typography>
        <IconButton edge="end" aria-label="Cuenta" className="text-primary">
          <AccountCircleOutlinedIcon className="size-8" />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
