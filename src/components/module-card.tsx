import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import type { AppModule } from '../config/modules'

type ModuleCardProps = {
  module: AppModule
}

/**
 * Tarjeta de acceso a un módulo (círculo con ícono + etiqueta). Navega a
 * `module.path` mediante el router. El borde/sombra/radio vienen del tema (MuiCard).
 */
function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Card>
      <CardActionArea
        component={Link}
        to={module.path}
        className="flex flex-col items-center gap-3 px-4 py-6"
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-surface-container text-primary">
          <module.Icon className="size-7" />
        </span>
        <Typography
          variant="inherit"
          component="span"
          className="font-semibold text-text-primary"
        >
          {module.label}
        </Typography>
      </CardActionArea>
    </Card>
  )
}

export default ModuleCard
