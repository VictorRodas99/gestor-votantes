import ModuleCard from '../components/module-card'
import { modules } from '../config/modules'

function HomePage() {
  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-4">
        {modules.map((module) => (
          <ModuleCard key={module.key} module={module} />
        ))}
      </div>
    </>
  )
}

export default HomePage
