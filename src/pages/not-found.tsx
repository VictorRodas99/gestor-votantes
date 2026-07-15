import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import EmptyState from '../components/empty-state'

function NotFound() {
  return (
    <EmptyState
      title="Página no encontrada"
      description="La ruta que buscás no existe o fue movida."
      action={
        <Button variant="contained" component={Link} to="/">
          Ir al inicio
        </Button>
      }
    />
  )
}

export default NotFound
