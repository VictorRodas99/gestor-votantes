// import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useLocation, useNavigate } from 'react-router-dom'
import { modules } from '../config/modules'
import { APP_NAME } from '../constants/app'

/**
 * Barra superior. El título se deriva de la ruta activa (etiqueta del módulo);
 * en Inicio muestra el nombre de la app.
 */
function TopBar() {
  const { pathname, key } = useLocation()
  const navigate = useNavigate()
  const activeModule = modules.find((module) =>
    pathname.startsWith(module.path)
  )
  const title = activeModule?.label ?? APP_NAME
  const isHome = pathname === '/'

  const goBack = () => {
    // `key === 'default'` = se entró directo a esta URL (sin historial propio):
    // volvemos al inicio en vez de salir de la app.
    if (key === 'default') navigate('/')
    else navigate(-1)
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      className="border-b border-divider bg-background-default"
    >
      <Toolbar>
        {isHome ? null : (
          <IconButton
            edge="start"
            aria-label="Volver"
            onClick={goBack}
            className="text-primary lg:hidden"
          >
            <ArrowBackRoundedIcon className="size-7" />
          </IconButton>
        )}
        <Typography
          variant="h6"
          component="h1"
          className="flex-1 text-center text-2xl font-semibold tracking-wide text-primary lg:text-left"
        >
          {title}
        </Typography>
        {/* <IconButton edge="end" aria-label="Cuenta" className="text-primary">
          <AccountCircleOutlinedIcon className="size-8" />
        </IconButton> */}
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
