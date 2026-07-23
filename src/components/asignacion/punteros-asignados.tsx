import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  useDesasignarPuntero,
  usePunterosAsignados,
  type PunteroAsignado
} from '../../hooks/services/asignaciones-punteros'
import ErrorState from '../error-state'
import VotanteCardSkeleton from '../votante-card-skeleton'
import AsignarPunteroDrawer from './asignar-puntero-drawer'
import ConfirmarDesasignarDialog from './confirmar-desasignar-dialog'
import PunteroAsignadoCard from './puntero-asignado-card'

type PunterosAsignadosProps = {
  votanteId: number
  votanteNombre: string
}

function PunterosAsignados({
  votanteId,
  votanteNombre
}: PunterosAsignadosProps) {
  const { punteros, isPending, isError, refetch } =
    usePunterosAsignados(votanteId)
  const desasignar = useDesasignarPuntero()

  const [drawerAbierto, setDrawerAbierto] = useState(false)
  const [aQuitar, setAQuitar] = useState<PunteroAsignado | null>(null)

  const asignadosIds = new Set(punteros.map((p) => p.id))
  const total = punteros.length

  const confirmarBaja = async () => {
    if (!aQuitar) return

    try {
      await toast
        .promise(
          desasignar.mutateAsync({
            asignacionId: aQuitar.asignacionId,
            votanteId,
            punteroId: aQuitar.id
          }),
          {
            loading: 'Quitando puntero…',
            success: (response) => response.message,
            error: (reason) =>
              reason instanceof Error ? reason.message : 'Ocurrió un error'
          }
        )
        .unwrap()
      setAQuitar(null)
    } catch {
      // El toast mostró el error; mantenemos el dialog para reintentar.
    }
  }

  const ctaAsignar = (
    <Button
      variant="outlined"
      fullWidth
      startIcon={<PersonAddRoundedIcon />}
      onClick={() => setDrawerAbierto(true)}
    >
      Asignar puntero
    </Button>
  )

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-body-lg font-semibold text-text-primary">
          Punteros Asignados
        </h2>
        {total > 0 ? (
          <Chip
            size="small"
            color="primary"
            label={`${total} ${total === 1 ? 'Activo' : 'Activos'}`}
          />
        ) : null}
      </div>

      {isPending ? (
        <div className="flex flex-col gap-2">
          <VotanteCardSkeleton />
          <VotanteCardSkeleton />
        </div>
      ) : isError ? (
        <ErrorState
          title="No pudimos cargar los punteros"
          onRetry={() => refetch()}
        />
      ) : total === 0 ? (
        <div className="flex flex-col gap-4 py-6 text-center">
          <p className="text-body-md text-text-secondary">
            Este votante todavía no tiene punteros asignados
          </p>
          {ctaAsignar}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {punteros.map((puntero) => (
              <PunteroAsignadoCard
                key={puntero.asignacionId}
                puntero={puntero}
                onQuitar={setAQuitar}
              />
            ))}
          </div>
          {ctaAsignar}
        </>
      )}

      <AsignarPunteroDrawer
        open={drawerAbierto}
        onClose={() => setDrawerAbierto(false)}
        votanteId={votanteId}
        asignadosIds={asignadosIds}
      />

      <ConfirmarDesasignarDialog
        open={aQuitar !== null}
        punteroNombre={aQuitar?.nombreApellido}
        votanteNombre={votanteNombre}
        isPending={desasignar.isPending}
        onConfirm={confirmarBaja}
        onCancel={() => setAQuitar(null)}
      />
    </section>
  )
}

export default PunterosAsignados
