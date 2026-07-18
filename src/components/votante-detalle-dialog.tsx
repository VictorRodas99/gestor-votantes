import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import AppBar from '@mui/material/AppBar'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import VotanteDetallePanel from './votante-detalle-panel'

type VotanteDetalleDialogProps = {
  /** Cédula del votante a mostrar; `null` = cerrado. */
  cedula: string | null
  onClose: () => void
}

function VotanteDetalleDialog({ cedula, onClose }: VotanteDetalleDialogProps) {
  return (
    <Dialog fullScreen open={Boolean(cedula)} onClose={onClose}>
      <AppBar
        position="sticky"
        elevation={0}
        color="transparent"
        className="border-b border-divider bg-background-default"
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="h2"
            className="flex-1 text-lg font-semibold text-primary"
          >
            Detalle del votante
          </Typography>
          <IconButton
            edge="end"
            aria-label="Cerrar"
            onClick={onClose}
            className="text-primary"
          >
            <CloseRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <div className="px-5 py-6">
        {cedula ? <VotanteDetallePanel cedula={cedula} /> : null}
      </div>
    </Dialog>
  )
}

export default VotanteDetalleDialog
