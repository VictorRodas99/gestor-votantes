import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import EmptyState from './empty-state'

function ViviendasVacio() {
  return (
    <EmptyState
      title="No hay viviendas registradas en este período"
      description="Ajustá los filtros o registrá una nueva vivienda para comenzar."
      action={
        <Button
          component={Link}
          to="/viviendas-no-atendidas/nueva"
          variant="contained"
          startIcon={<AddRoundedIcon />}
        >
          Agregar Vivienda
        </Button>
      }
    />
  )
}

export default ViviendasVacio
