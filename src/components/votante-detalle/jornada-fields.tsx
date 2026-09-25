import type { SvgIconComponent } from '@mui/icons-material'
import HowToVoteRoundedIcon from '@mui/icons-material/HowToVoteRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import Alert from '@mui/material/Alert'
import Switch from '@mui/material/Switch'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { JORNADA_ESCRITURA_HABILITADA } from '../../constants/config'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import FormField from '../wizard/form-field'

type FilaSwitchProps = {
  label: string
  Icon: SvgIconComponent
  checked: boolean
  disabled?: boolean
  ayuda?: string
  error?: string
  onChange: (checked: boolean) => void
}

function FilaSwitch({
  label,
  Icon,
  checked,
  disabled,
  ayuda,
  error,
  onChange
}: FilaSwitchProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-text-secondary">
        <Icon fontSize="small" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-body-lg font-medium text-text-primary">
          {label}
        </span>
        {error ? (
          <span className="text-label-sm text-error">{error}</span>
        ) : ayuda ? (
          <span className="text-label-sm text-text-secondary">{ayuda}</span>
        ) : null}
      </span>

      <Switch
        checked={checked}
        disabled={disabled}
        onChange={(_, value) => onChange(value)}
        slotProps={{ input: { 'aria-label': label } }}
      />
    </div>
  )
}

/** ¿Ya votó? · ¿Cobró? · Obs de Jornada — primeros en la tab Votación. */
export default function JornadaFields() {
  const { control, setValue } = useFormContext<WizardFormData>()
  const yavoto = useWatch({ control, name: 'yavoto' })
  const bloqueado = !JORNADA_ESCRITURA_HABILITADA

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-label-md font-semibold text-text-secondary uppercase">
        Jornada
      </h3>

      {bloqueado && (
        <Alert severity="info">
          Se podrá guardar cuando el servidor lo habilite.
        </Alert>
      )}

      <div className="rounded-lg border border-divider bg-surface-container-lowest">
        <Controller
          name="yavoto"
          control={control}
          render={({ field }) => (
            <FilaSwitch
              label="¿Ya votó?"
              Icon={HowToVoteRoundedIcon}
              checked={Boolean(field.value)}
              disabled={bloqueado}
              onChange={(checked) => {
                field.onChange(checked)
                // No se puede haber cobrado sin votar.
                if (!checked) {
                  setValue('cobro', false, {
                    shouldDirty: true,
                    shouldValidate: true
                  })
                }
              }}
            />
          )}
        />

        <div className="border-t border-divider">
          <Controller
            name="cobro"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FilaSwitch
                label="¿Cobró?"
                Icon={PaymentsRoundedIcon}
                checked={Boolean(field.value)}
                // Si ya viene en `true` sin voto (dato inconsistente) se deja
                // apagarlo, que es la única forma de corregirlo.
                disabled={bloqueado || (!yavoto && !field.value)}
                ayuda={yavoto ? undefined : 'Primero marcá que ya votó'}
                error={error?.message}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <FormField
        name="obs"
        label="Obs de Jornada"
        placeholder="Notas del día de la elección…"
        multiline
        minRows={2}
        disabled={bloqueado}
      />
    </section>
  )
}
