import type { SvgIconComponent } from '@mui/icons-material'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import ContactPhoneRoundedIcon from '@mui/icons-material/ContactPhoneRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded'
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded'
import HowToVoteRoundedIcon from '@mui/icons-material/HowToVoteRounded'
import Switch from '@mui/material/Switch'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'

type ToggleName =
  | 'afiliacion'
  | 'voto_seguro'
  | 'voto_intendente'
  | 'voto_intendente_anr'
  | 'voto_intendente_alianza'
  | 'voto_concejal'
  | 'movil'
  | 'contactado'
  | 'visitado'
  | 'volver_visitar'

type ToggleRow = {
  name: ToggleName
  label: string
  Icon: SvgIconComponent
  /** El chip de "Necesita móvil" va en ámbar (semántica de atención, día D). */
  accent?: boolean
  /** Subcampos que solo se muestran cuando esta fila está en `true`. */
  dependientes?: ToggleRow[]
}

const TOGGLES: ToggleRow[] = [
  { name: 'afiliacion', label: 'Afiliado', Icon: BadgeRoundedIcon },
  { name: 'voto_seguro', label: 'Voto seguro', Icon: HowToVoteRoundedIcon },
  {
    name: 'voto_intendente',
    label: 'Voto intendente',
    Icon: AccountBalanceRoundedIcon,
    dependientes: [
      { name: 'voto_intendente_anr', label: 'ANR', Icon: HowToVoteRoundedIcon },
      {
        name: 'voto_intendente_alianza',
        label: 'Alianza',
        Icon: HandshakeRoundedIcon
      }
    ]
  },
  { name: 'voto_concejal', label: 'Voto concejal', Icon: GroupsRoundedIcon },
  {
    name: 'movil',
    label: 'Necesita móvil',
    Icon: DirectionsCarRoundedIcon,
    accent: true
  },
  { name: 'contactado', label: 'Contactado', Icon: ContactPhoneRoundedIcon },
  { name: 'visitado', label: 'Visitado', Icon: HowToRegRoundedIcon },
  {
    name: 'volver_visitar',
    label: 'Volver a visitar',
    Icon: EventRepeatRoundedIcon
  }
]

type FilaToggleProps = ToggleRow & {
  anidado?: boolean
  onToggle: (name: ToggleName, checked: boolean) => void
}

function FilaToggle({
  name,
  label,
  Icon,
  accent,
  anidado,
  onToggle
}: FilaToggleProps) {
  const { control } = useFormContext<WizardFormData>()

  return (
    <div
      className={`flex items-center gap-3 px-4 ${anidado ? 'py-2' : 'py-3'}`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-full ${
          anidado ? 'size-7' : 'size-9'
        } ${
          accent
            ? 'bg-warning-light text-warning-dark'
            : 'bg-surface-container-high text-text-secondary'
        }`}
      >
        <Icon fontSize="small" />
      </span>

      <span
        className={`flex-1 font-medium text-text-primary ${
          anidado ? 'text-body-md' : 'text-body-lg'
        }`}
      >
        {label}
      </span>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Switch
            checked={Boolean(field.value)}
            size={anidado ? 'small' : 'medium'}
            onChange={(_, checked) => {
              field.onChange(checked)
              onToggle(name, checked)
            }}
            onBlur={field.onBlur}
          />
        )}
      />
    </div>
  )
}

export default function CompromisoToggles() {
  const { control, setValue, formState } = useFormContext<WizardFormData>()
  const votoIntendente = useWatch({ control, name: 'voto_intendente' })

  const errorIntendente = formState.errors.voto_intendente_anr?.message

  const alCambiar = (name: ToggleName, checked: boolean) => {
    const opciones = { shouldValidate: true } as const

    if (name === 'voto_intendente' && !checked) {
      setValue('voto_intendente_anr', false, opciones)
      setValue('voto_intendente_alianza', false, opciones)
      return
    }

    // ANR y Alianza son fuerzas opuestas
    if (name === 'voto_intendente_anr' && checked) {
      setValue('voto_intendente_alianza', false, opciones)
    }
    if (name === 'voto_intendente_alianza' && checked) {
      setValue('voto_intendente_anr', false, opciones)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-title-md text-text-primary">Estado de compromiso</h2>

      <div className="rounded-lg border border-divider bg-surface-container-lowest">
        {TOGGLES.map((fila, index) => (
          <div
            key={fila.name}
            className={index > 0 ? 'border-t border-divider' : ''}
          >
            <FilaToggle {...fila} onToggle={alCambiar} />

            {fila.dependientes && votoIntendente && (
              <div className="mb-1 ml-7 border-l border-divider">
                {fila.dependientes.map((dependiente) => (
                  <FilaToggle
                    key={dependiente.name}
                    {...dependiente}
                    anidado
                    onToggle={alCambiar}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {errorIntendente && (
        <span className="text-label-sm text-error">{errorIntendente}</span>
      )}
    </div>
  )
}
