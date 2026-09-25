import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import Button from '@mui/material/Button'
import { useFormState } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'

type GuardarBarraProps = {
  onGuardar: () => void
  onDescartar: () => void
}

/**
 * Desktop: barra fija al pie del panel, fuera del área que scrollea. No
 * desaparece sin cambios para que el layout no salte al empezar a editar.
 */
export default function GuardarBarra({
  onGuardar,
  onDescartar
}: GuardarBarraProps) {
  const { isDirty, isSubmitting, dirtyFields } = useFormState<WizardFormData>()
  const cambios = Object.keys(dirtyFields).length

  return (
    <div className="flex flex-none items-center gap-2 border-t border-divider pt-3">
      <span className="flex min-w-0 flex-1 items-center gap-2 text-label-md text-text-secondary">
        {isDirty && (
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-full bg-warning"
          />
        )}
        <span className="truncate">
          {isDirty
            ? `${cambios} ${cambios === 1 ? 'cambio' : 'cambios'} sin guardar`
            : 'Sin cambios'}
        </span>
      </span>

      {isDirty && (
        <Button onClick={onDescartar} disabled={isSubmitting}>
          Descartar
        </Button>
      )}
      <Button
        variant="contained"
        onClick={onGuardar}
        disabled={!isDirty}
        loading={isSubmitting}
        loadingPosition="start"
        startIcon={<SaveRoundedIcon />}
      >
        Guardar
      </Button>
    </div>
  )
}
