import type { SvgIconComponent } from '@mui/icons-material'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import HowToVoteRoundedIcon from '@mui/icons-material/HowToVoteRounded'
import Switch from '@mui/material/Switch'
import { Controller, useFormContext } from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'

type ToggleName =
  'afiliacion' | 'voto_seguro' | 'voto_intendente' | 'voto_concejal' | 'movil'

type ToggleRow = {
  name: ToggleName
  label: string
  Icon: SvgIconComponent
  /** El chip de "Necesita móvil" va en ámbar (semántica de atención, día D). */
  accent?: boolean
}

const TOGGLES: ToggleRow[] = [
  { name: 'afiliacion', label: 'Afiliado', Icon: BadgeRoundedIcon },
  { name: 'voto_seguro', label: 'Voto seguro', Icon: HowToVoteRoundedIcon },
  {
    name: 'voto_intendente',
    label: 'Voto intendente',
    Icon: AccountBalanceRoundedIcon
  },
  { name: 'voto_concejal', label: 'Voto concejal', Icon: GroupsRoundedIcon },
  {
    name: 'movil',
    label: 'Necesita móvil',
    Icon: DirectionsCarRoundedIcon,
    accent: true
  }
]

/**
 * Card "Estado de compromiso": una fila por marca sí/no. Cada `Switch` es un
 * `Controller` sobre su campo boolean de la fuente única (§5 del plan).
 */
export default function CompromisoToggles() {
  const { control } = useFormContext<WizardFormData>()

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-title-md text-text-primary">Estado de compromiso</h2>

      <div className="rounded-lg border border-divider bg-surface-container-lowest">
        {TOGGLES.map(({ name, label, Icon, accent }, index) => (
          <div
            key={name}
            className={`flex items-center gap-3 px-4 py-3 ${
              index > 0 ? 'border-t border-divider' : ''
            }`}
          >
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                accent
                  ? 'bg-warning-light text-warning-dark'
                  : 'bg-surface-container-high text-text-secondary'
              }`}
            >
              <Icon fontSize="small" />
            </span>

            <span className="flex-1 text-body-lg font-medium text-text-primary">
              {label}
            </span>

            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <Switch
                  checked={Boolean(field.value)}
                  onChange={(_, checked) => field.onChange(checked)}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
