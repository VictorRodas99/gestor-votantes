import Typography from '@mui/material/Typography'
import AccionesInicio from '../components/home/acciones-inicio'
import ModuleCard from '../components/module-card'
import StatCard from '../components/stat-card'
import { homeStats } from '../config/home-stats'
import { modules } from '../config/modules'
import { useResumenCampana } from '../hooks/services/resumen'

function HomePage() {
  const { data: resumen, isPending } = useResumenCampana()

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
        <AccionesInicio />
      </div>

      <div className="lg:hidden">
        <AccionesInicio compact />
      </div>

      <div className="hidden gap-4 lg:grid lg:grid-cols-4">
        {homeStats.map((stat) => (
          <StatCard
            key={stat.key}
            stat={stat}
            value={resumen?.[stat.key]}
            isLoading={isPending}
          />
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
