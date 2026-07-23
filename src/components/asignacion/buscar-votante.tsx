import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useVotantesBusqueda } from '../../hooks/services/votantes'
import type { VotanteReciente } from '../../hooks/use-recientes-asignacion'
import { formatCedula, getInitials } from '../../lib/format'
import type { Votante } from '../../types/votante'
import ErrorState from '../error-state'
import SearchBar from '../search-bar'
import VotanteCardSkeleton from '../votante-card-skeleton'
import PersonaListItem from './persona-list-item'
import VotanteRecientes from './votante-recientes'

type BuscarVotanteProps = {
  recientes: VotanteReciente[]
  onSelect: (votante: Votante) => void
  onSelectReciente: (reciente: VotanteReciente) => void
}

/** Ilustración de estado vacío/sin resultados (diseño §3). */
function Ilustracion({ titulo, hint }: { titulo: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-surface-container-low">
        <PersonSearchRoundedIcon className="text-text-secondary" fontSize="large" />
      </span>
      <p className="text-body-md text-text-secondary">{titulo}</p>
      {hint ? <p className="text-label-md text-text-secondary">{hint}</p> : null}
    </div>
  )
}

function BuscarVotante({
  recientes,
  onSelect,
  onSelectReciente
}: BuscarVotanteProps) {
  const [search, setSearch] = useState('')
  const [debounced] = useDebounce(search, 400)

  const termino = debounced.trim()
  const tieneTermino = termino.length > 0
  const { data, isLoading, isError, refetch } = useVotantesBusqueda(debounced)

  const votantes = data?.votantes ?? []

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        placeholder="Buscar votante por cédula o nombre"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {!tieneTermino ? (
        <>
          <Ilustracion titulo="Buscá un votante para ver y asignar sus punteros" />
          <VotanteRecientes recientes={recientes} onSelect={onSelectReciente} />
        </>
      ) : isLoading ? (
        <div className="flex flex-col gap-2">
          <VotanteCardSkeleton />
          <VotanteCardSkeleton />
          <VotanteCardSkeleton />
        </div>
      ) : isError ? (
        <ErrorState
          title="No pudimos buscar votantes"
          description="Revisá tu conexión e intentá de nuevo."
          onRetry={() => refetch()}
        />
      ) : votantes.length === 0 ? (
        <Ilustracion
          titulo={`No encontramos votantes con «${termino}»`}
          hint="Verificá la cédula o probá con el apellido"
        />
      ) : (
        <div className="flex flex-col gap-2">
          {votantes.map((votante) => (
            <PersonaListItem
              key={votante.cedula}
              seed={votante.cedula}
              iniciales={getInitials(votante.nombreCompleto)}
              titulo={votante.nombreCompleto}
              subtitulo={`CI: ${formatCedula(votante.cedula)}`}
              onClick={() => onSelect(votante)}
              ariaLabel={`Seleccionar a ${votante.nombreCompleto}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default BuscarVotante
