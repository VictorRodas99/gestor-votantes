import Drawer from '@mui/material/Drawer'
import AsignarPunteroPicker from './asignar-puntero-picker'

type AsignarPunteroDrawerProps = {
  open: boolean
  onClose: () => void
  votanteId: number
  /** Ids de punteros ya asignados: se muestran deshabilitados y se re-chequean. */
  asignadosIds: Set<number>
}

function AsignarPunteroDrawer({
  open,
  onClose,
  votanteId,
  asignadosIds
}: AsignarPunteroDrawerProps) {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { className: 'h-[75dvh] rounded-t-2xl' } }}
    >
      <div className="flex h-full flex-col overflow-y-auto p-4">
        <AsignarPunteroPicker
          votanteIds={[votanteId]}
          asignadosIds={asignadosIds}
          onAsignado={onClose}
        />
      </div>
    </Drawer>
  )
}

export default AsignarPunteroDrawer
