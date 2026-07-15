import ModuleCard from '../components/module-card'
import SearchBar from '../components/search-bar'
import { modules } from '../config/modules'

/**
 * Inicio: buscador rápido por cédula + accesos a los módulos. La barra superior
 * e inferior las aporta `AppLayout`, por eso acá solo va el contenido.
 */
function HomePage() {
  return (
    <>
      <SearchBar placeholder="Buscar votante por cédula" />

      <div className="mt-5 grid grid-cols-2 gap-4">
        {modules.map((module) => (
          <ModuleCard key={module.key} module={module} />
        ))}
      </div>
    </>
  )
}

export default HomePage
