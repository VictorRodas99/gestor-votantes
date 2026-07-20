import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import { useFormContext, useWatch } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import { formatCedula } from '../../lib/format'

function iniciales(nombre?: string, apellido?: string): string {
  const a = nombre?.trim()?.[0] ?? ''
  const b = apellido?.trim()?.[0] ?? ''
  return (a + b).toUpperCase() || '?'
}

/**
 * Tarjeta de contexto (solo lectura) del votante en carga
 */
export default function VotanteActualCard() {
  const { control } = useFormContext<WizardFormData>()
  const nombre = useWatch({ control, name: 'nombre' })
  const apellido = useWatch({ control, name: 'apellido' })
  const cedula = useWatch({ control, name: 'cedula' })
  const calle = useWatch({ control, name: 'direccion.calle' })
  const celular = useWatch({ control, name: 'celular' })

  const nombreCompleto = [nombre, apellido].filter(Boolean).join(' ')

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-primary p-5 text-primary-contrast">
      <span className="text-label-sm font-semibold tracking-wide opacity-80">
        VOTANTE ACTUAL
      </span>

      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-body-lg font-semibold text-primary">
          {iniciales(nombre, apellido)}
        </span>
        <span className="flex flex-col">
          <span className="text-body-lg font-semibold">
            {nombreCompleto || '—'}
          </span>
          {cedula && (
            <span className="text-label-md opacity-80">
              CI {formatCedula(cedula)}
            </span>
          )}
        </span>
      </div>

      {(calle || celular) && (
        <div className="flex flex-col gap-2 border-t border-primary-contrast/20 pt-3 text-label-md">
          {calle && (
            <span className="flex items-center gap-2">
              <PlaceRoundedIcon
                fontSize="small"
                className="shrink-0 opacity-80"
              />
              {calle}
            </span>
          )}
          {celular && (
            <span className="flex items-center gap-2">
              <PhoneRoundedIcon
                fontSize="small"
                className="shrink-0 opacity-80"
              />
              {celular}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
