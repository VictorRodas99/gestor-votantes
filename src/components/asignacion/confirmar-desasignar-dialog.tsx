import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

type ConfirmarDesasignarDialogProps = {
  open: boolean
  punteroNombre?: string
  votanteNombre: string
  isPending: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmarDesasignarDialog({
  open,
  punteroNombre,
  votanteNombre,
  isPending,
  onConfirm,
  onCancel
}: ConfirmarDesasignarDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Quitar puntero</DialogTitle>
      <DialogContent>
        <DialogContentText>
          «{punteroNombre}» dejará de estar asignado a «{votanteNombre}».
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={isPending}
        >
          Quitar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmarDesasignarDialog
