import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { APP_NAME } from '../constants/app'

function TopBar() {
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
          {APP_NAME}
        </Typography>
        <IconButton edge="end" aria-label="Cuenta" className="text-primary">
          <AccountCircleOutlinedIcon className="size-8" />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
