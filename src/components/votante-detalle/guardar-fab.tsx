import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import CircularProgress from '@mui/material/CircularProgress'
import Fab from '@mui/material/Fab'
import { useFormState } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'

export default function GuardarFab({ onGuardar }: { onGuardar: () => void }) {
  const { isDirty, isSubmitting } = useFormState<WizardFormData>()

  return (
    <Fab
      variant="extended"
      color="primary"
      onClick={onGuardar}
      disabled={!isDirty || isSubmitting}
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] gap-2"
    >
      {isSubmitting ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        <SaveRoundedIcon />
      )}
      Guardar
    </Fab>
  )
}
