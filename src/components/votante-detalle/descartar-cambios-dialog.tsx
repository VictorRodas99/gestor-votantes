import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

type DescartarCambiosDialogProps = {
  open: boolean
  onDescartar: () => void
  onSeguir: () => void
}

export default function DescartarCambiosDialog({
  open,
  onDescartar,
  onSeguir
}: DescartarCambiosDialogProps) {
  return (
    <Dialog open={open} onClose={onSeguir}>
      <DialogTitle>¿Descartar cambios?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Tenés cambios sin guardar en este votante. Si salís, se pierden.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSeguir} autoFocus>
          Seguir editando
        </Button>
        <Button color="error" onClick={onDescartar}>
          Descartar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
