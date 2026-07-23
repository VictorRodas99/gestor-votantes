import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import { toast } from 'sonner'
import { useDebounce } from 'use-debounce'
import type { PunteroFormData } from '../../forms/puntero/puntero.schema'
import { useAsignarPuntero } from '../../hooks/services/asignaciones-punteros'
import {
  useCrearPuntero,
  usePunterosSearch
} from '../../hooks/services/punteros'
import { formatCedula, getInitials } from '../../lib/format'
import type { Puntero } from '../../types/puntero'
import ErrorState from '../error-state'
import SearchBar from '../search-bar'
import VotanteCardSkeleton from '../votante-card-skeleton'
import CrearPunteroForm from './crear-puntero-form'
import PersonaListItem from './persona-list-item'

type Modo = 'buscar' | 'crear'

type AsignarPunteroDrawerProps = {
  open: boolean
  onClose: () => void
  votanteId: number
  /** Ids de punteros ya asignados: se muestran deshabilitados y se re-chequean. */
  asignadosIds: Set<number>
}

function mensajeError(reason: unknown): string {
  return reason instanceof Error ? reason.message : 'Ocurrió un error'
}

function AsignarPunteroDrawer({
  open,
  onClose,
  votanteId,
  asignadosIds
}: AsignarPunteroDrawerProps) {
  const [modo, setModo] = useState<Modo>('buscar')
  const [search, setSearch] = useState('')
  const [debounced] = useDebounce(search, 400)

  const asignar = useAsignarPuntero()
  const crear = useCrearPuntero()

  const resetInterno = () => {
    setModo('buscar')
    setSearch('')
  }

  const termino = debounced.trim()
  const {
    data: punteros = [],
    isLoading,
    isError,
    refetch
  } = usePunterosSearch(debounced)

  const handleAsignar = async (puntero: Puntero) => {
    if (asignadosIds.has(puntero.id)) {
      toast.info('Ese puntero ya está asignado a este votante')
      return
    }

    try {
      await toast
        .promise(asignar.mutateAsync({ votanteId, punteroId: puntero.id }), {
          loading: 'Asignando puntero…',
          success: (response) => response.message,
          error: mensajeError
        })
        .unwrap()
      onClose()
    } catch {
      // El toast ya mostró el error; el drawer permanece abierto.
    }
  }

  const handleCrear = async (data: PunteroFormData) => {
    try {
      await toast
        .promise(
          (async () => {
            const { pkey } = await crear.mutateAsync(data)
            if (asignadosIds.has(pkey)) {
              return { message: 'Ese puntero ya estaba asignado' }
            }
            return asignar.mutateAsync({ votanteId, punteroId: pkey })
          })(),
          {
            loading: 'Creando y asignando…',
            success: (response) => response.message,
            error: mensajeError
          }
        )
        .unwrap()
      onClose()
    } catch {
      // El puntero pudo quedar creado pero sin asignar; el drawer no se cierra
      // ni pierde lo tipeado para poder reintentar.
    }
  }

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          className: 'h-[75dvh] rounded-t-2xl'
        },
        transition: {
          onExited: resetInterno
        }
      }}
    >
      <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
        <div className="flex items-center gap-2">
          {modo === 'crear' ? (
            <IconButton
              onClick={() => setModo('buscar')}
              aria-label="Volver a la búsqueda"
              edge="start"
            >
              <ArrowBackRoundedIcon />
            </IconButton>
          ) : null}
          <h2 className="text-body-lg font-semibold text-text-primary">
            {modo === 'crear' ? 'Crear puntero' : 'Asignar puntero'}
          </h2>
        </div>

        {modo === 'crear' ? (
          <CrearPunteroForm
            isPending={crear.isPending || asignar.isPending}
            onSubmit={handleCrear}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <SearchBar
                placeholder="Buscar puntero por cédula o nombre"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Button
                variant="contained"
                aria-label="Crear puntero nuevo"
                onClick={() => setModo('crear')}
                className="bg-primary-container text-white"
              >
                <PersonAddRoundedIcon />
              </Button>
            </div>

            {isLoading && termino ? (
              <div className="flex flex-col gap-2">
                <VotanteCardSkeleton />
                <VotanteCardSkeleton />
              </div>
            ) : isError ? (
              <ErrorState
                title="No pudimos buscar punteros"
                onRetry={() => refetch()}
              />
            ) : (
              <div className="flex flex-col gap-2">
                {punteros.map((puntero) => {
                  const yaAsignado = asignadosIds.has(puntero.id)
                  return (
                    <PersonaListItem
                      key={puntero.id}
                      seed={puntero.cedula}
                      iniciales={getInitials(puntero.nombreApellido)}
                      titulo={puntero.nombreApellido}
                      subtitulo={`CI: ${formatCedula(puntero.cedula)}`}
                      disabled={yaAsignado}
                      onClick={() => handleAsignar(puntero)}
                      ariaLabel={`Asignar a ${puntero.nombreApellido}`}
                      trailing={
                        yaAsignado ? (
                          <span className="text-label-sm text-text-secondary">
                            Ya asignado
                          </span>
                        ) : undefined
                      }
                    />
                  )
                })}

                {termino && punteros.length === 0 ? (
                  <p className="py-6 text-center text-body-md text-text-secondary">
                    No hay punteros con "{termino}". Creá uno nuevo con el botón
                    de arriba.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </Drawer>
  )
}

export default AsignarPunteroDrawer
