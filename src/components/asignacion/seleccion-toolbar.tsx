import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Button from '@mui/material/Button'

type SeleccionToolbarProps = {
  count: number
  onLimpiar: () => void
}

function SeleccionToolbar({ count, onLimpiar }: SeleccionToolbarProps) {
  if (count === 0) return null

  return (
    <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-2">
      <span className="text-body-md font-semibold text-primary">
        {count} {count === 1 ? 'seleccionado' : 'seleccionados'}
      </span>
      <Button
        size="small"
        color="inherit"
        startIcon={<CloseRoundedIcon />}
        onClick={onLimpiar}
        className="text-text-secondary"
      >
        Limpiar
      </Button>
    </div>
  )
}

export default SeleccionToolbar
