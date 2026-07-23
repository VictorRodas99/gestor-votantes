import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import type { VotanteReciente } from '../../hooks/use-recientes-asignacion'
import { formatCedula, getInitials } from '../../lib/format'
import PersonaListItem from './persona-list-item'

type VotanteRecientesProps = {
  recientes: VotanteReciente[]
  onSelect: (reciente: VotanteReciente) => void
}

function VotanteRecientes({ recientes, onSelect }: VotanteRecientesProps) {
  if (recientes.length === 0) return null

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-label-sm font-semibold tracking-wide text-text-secondary uppercase">
        Recientes
      </h2>
      {recientes.map((reciente) => (
        <PersonaListItem
          key={reciente.cedula}
          seed={reciente.cedula}
          iniciales={getInitials(reciente.nombreCompleto)}
          titulo={reciente.nombreCompleto}
          subtitulo={`CI: ${formatCedula(reciente.cedula)}`}
          trailing={
            <ChevronRightRoundedIcon className="text-text-secondary" />
          }
          onClick={() => onSelect(reciente)}
          ariaLabel={`Seleccionar a ${reciente.nombreCompleto}`}
        />
      ))}
    </section>
  )
}

export default VotanteRecientes
