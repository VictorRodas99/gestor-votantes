import MapsHomeWorkRoundedIcon from '@mui/icons-material/MapsHomeWorkRounded'
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

type AccionesInicioProps = {
  compact?: boolean
}

function AccionesInicio({ compact }: AccionesInicioProps) {
  return (
    <div className={compact ? 'flex gap-3 md:justify-end' : 'flex gap-3'}>
      <Button
        component={Link}
        to="/viviendas-no-atendidas/nueva"
        variant="outlined"
        startIcon={<MapsHomeWorkRoundedIcon />}
        className={compact ? 'flex-1 md:flex-none' : undefined}
      >
        {compact ? 'Viviendas' : 'Viviendas No Atendidas'}
      </Button>
      <Button
        component={Link}
        to="/votantes/nuevo"
        variant="contained"
        startIcon={<PersonAddAltRoundedIcon />}
        className={compact ? 'flex-1 md:flex-none' : undefined}
      >
        Nuevo Votante
      </Button>
    </div>
  )
}

export default AccionesInicio
