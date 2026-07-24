import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { toast } from 'sonner'
import { useDebounce } from 'use-debounce'
import type { PunteroFormData } from '../../forms/puntero/puntero.schema'
import { useAsignarPuntero } from '../../hooks/services/asignaciones-punteros'
import { useBarrios, useSectores } from '../../hooks/services/catalogos'
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

type AsignarPunteroPickerProps = {
  /** Votantes destino de la asignación: 1 en modo detalle, N en bulk. */
  votanteIds: number[]
  /** Punteros ya asignados (deshabilitados). Se ignora en bulk. */
  asignadosIds?: Set<number>
  /** Muestra los filtros barrio/sector (solo desktop). */
  mostrarFiltros?: boolean
  /** Se llama tras asignar/crear con éxito (p. ej. cerrar el drawer). */
  onAsignado?: () => void
}

function mensajeError(reason: unknown): string {
  return reason instanceof Error ? reason.message : 'Ocurrió un error'
}

const SIN_ASIGNADOS: Set<number> = new Set()

/**
 * Buscar/crear un puntero y asignarlo a uno o varios votantes
 */
function AsignarPunteroPicker({
  votanteIds,
  asignadosIds = SIN_ASIGNADOS,
  mostrarFiltros = false,
  onAsignado
}: AsignarPunteroPickerProps) {
  const [modo, setModo] = useState<Modo>('buscar')
  const [search, setSearch] = useState('')
  const [debounced] = useDebounce(search, 400)
  const [barrioId, setBarrioId] = useState<number | undefined>(undefined)
  const [sectorId, setSectorId] = useState<number | undefined>(undefined)

  const asignar = useAsignarPuntero()
  const crear = useCrearPuntero()

  const { data: barrios } = useBarrios()
  const { data: sectores } = useSectores()

  const termino = debounced.trim()
  const {
    data: punteros = [],
    isLoading,
    isError,
    refetch
  } = usePunterosSearch(
    debounced,
    mostrarFiltros ? { barrioId, sectorId } : undefined
  )

  const esBulk = votanteIds.length > 1

  const asignarATodos = (punteroId: number) =>
    Promise.all(
      votanteIds.map((votanteId) =>
        asignar.mutateAsync({ votanteId, punteroId })
      )
    )

  const handleAsignar = async (puntero: Puntero) => {
    if (!esBulk && asignadosIds.has(puntero.id)) {
      toast.info('Ese puntero ya está asignado a este votante')
      return
    }

    try {
      if (esBulk) {
        await toast
          .promise(asignarATodos(puntero.id), {
            loading: `Asignando a ${votanteIds.length} votantes…`,
            success: `Puntero asignado a ${votanteIds.length} votantes`,
            error: mensajeError
          })
          .unwrap()
      } else {
        await toast
          .promise(
            asignar.mutateAsync({
              votanteId: votanteIds[0],
              punteroId: puntero.id
            }),
            {
              loading: 'Asignando puntero…',
              success: (response) => response.message,
              error: mensajeError
            }
          )
          .unwrap()
      }
      onAsignado?.()
    } catch {
      // El toast ya mostró el error.
    }
  }

  const handleCrear = async (data: PunteroFormData) => {
    try {
      await toast
        .promise(
          (async () => {
            const { pkey } = await crear.mutateAsync(data)
            if (esBulk) {
              await asignarATodos(pkey)
              return {
                message: `Puntero creado y asignado a ${votanteIds.length} votantes`
              }
            }
            if (asignadosIds.has(pkey)) {
              return { message: 'Ese puntero ya estaba asignado' }
            }
            return asignar.mutateAsync({
              votanteId: votanteIds[0],
              punteroId: pkey
            })
          })(),
          {
            loading: 'Creando y asignando…',
            success: (response) => response.message,
            error: mensajeError
          }
        )
        .unwrap()
      onAsignado?.()
    } catch {
      // El puntero pudo quedar creado pero sin asignar; no se pierde lo tipeado.
    }
  }

  return (
    <div className="flex flex-col gap-4">
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

          {mostrarFiltros ? (
            <div className="flex gap-2">
              <Autocomplete
                className="flex-1"
                size="small"
                options={barrios ?? []}
                value={
                  barrios?.find((barrio) => barrio.id === barrioId) ?? null
                }
                getOptionLabel={(option) => option.denominacion}
                getOptionKey={(option) => option.id}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, option) => setBarrioId(option?.id)}
                noOptionsText="Sin barrios"
                renderInput={(params) => (
                  <TextField {...params} placeholder="Barrio" />
                )}
              />
              <Autocomplete
                className="flex-1"
                size="small"
                options={sectores ?? []}
                value={
                  sectores?.find((sector) => sector.id === sectorId) ?? null
                }
                getOptionLabel={(option) => option.denominacion}
                getOptionKey={(option) => option.id}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, option) => setSectorId(option?.id)}
                noOptionsText="Sin sectores"
                renderInput={(params) => (
                  <TextField {...params} placeholder="Sector" />
                )}
              />
            </div>
          ) : null}

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
                const yaAsignado = !esBulk && asignadosIds.has(puntero.id)
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
  )
}

export default AsignarPunteroPicker
