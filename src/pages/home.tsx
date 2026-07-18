import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import ModuleCard from '../components/module-card'
import StatCard from '../components/stat-card'
import { homeStats } from '../config/home-stats'
import { modules } from '../config/modules'

function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="hidden items-start justify-between lg:flex">
        <div>
          <Typography variant="h4" component="h1" className="text-text-primary">
            Inicio
          </Typography>
          <Typography variant="body2" className="text-text-secondary">
            Resumen del estado de la campaña.
          </Typography>
        </div>
        <Button
          component={Link}
          to="/votantes/nuevo"
          variant="contained"
          startIcon={<PersonAddAltRoundedIcon />}
        >
          Nuevo Votante
        </Button>
      </div>

      <div className="hidden gap-4 lg:grid lg:grid-cols-4">
        {homeStats.map((stat) => (
          <StatCard key={stat.key} stat={stat} />
        ))}
      </div>

      <section>
        <Typography
          variant="h6"
          component="h2"
          className="mb-3 hidden text-text-primary lg:block"
        >
          Accesos Rápidos
        </Typography>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {modules.map((module) => (
            <ModuleCard key={module.key} module={module} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
