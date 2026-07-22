import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import Autocomplete from '@mui/material/Autocomplete'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useState } from 'react'
import {
  Controller,
  useFormContext,
  useFormState,
  useWatch
} from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import { useSectores } from '../../hooks/services/catalogos'
import { useReferentesSearch } from '../../hooks/services/referentes'
import type { Referente } from '../../types/referente'
import BarrioSelect from './barrio-select'
import { FieldShell } from './form-field'

type Modo = 'elegir' | 'crear'

/**
 * "Agregar referente" (opcional, §1.5): elegir uno existente (setea `referente_id`)
 * o crear uno nuevo inline (`nuevo_referente`). El barrio sale del `barrio_id`
 * compartido (espejo, §1.4).
 */
export default function ReferenteField() {
  const { control, setValue } = useFormContext<WizardFormData>()
  const referenteId = useWatch({ control, name: 'referente_id' })
  const nuevoReferente = useWatch({ control, name: 'nuevo_referente' })
  const { errors } = useFormState({ control, name: 'referente_id' })
  const referenteError = errors.referente_id?.message

  const yaAsignado = referenteId != null || nuevoReferente != null
  const [abiertoManual, setAbiertoManual] = useState(false)
  const abierto = yaAsignado || abiertoManual
  const [modo, setModo] = useState<Modo>(nuevoReferente ? 'crear' : 'elegir')

  const [busqueda, setBusqueda] = useState('')
  const [debounced] = useDebounce(busqueda, 400)
  const { data: referentes, isFetching } = useReferentesSearch(debounced)
  const { data: sectores } = useSectores()

  const limpiar = () => {
    setValue('referente_id', undefined)
    setValue('nuevo_referente', undefined)
  }

  const cambiarModo = (nuevoModo: Modo) => {
    setModo(nuevoModo)
    limpiar()
    if (nuevoModo === 'crear') {
      setValue('nuevo_referente', {
        nombre_apellido: '',
        cedula: '',
        celular: '',
        afiliacion: false,
        sector_id: undefined
      })
    }
  }

  const seleccionarExistente = (referente: Referente | null) => {
    setValue('referente_id', referente?.id)
    // Espejo: el barrio del referente se refleja en el campo compartido.
    if (referente) setValue('barrio_id', referente.barrioId || undefined)
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbiertoManual(true)}
        className={`flex items-center gap-3 rounded-md border bg-surface-container-low px-4 py-3 text-left ${
          referenteError ? 'border-error' : 'border-divider'
        }`}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-contrast">
          <PersonAddAlt1RoundedIcon />
        </span>
        <span className="flex flex-1 flex-col">
          <span className="text-body-md font-semibold text-text-primary">
            Agregar referente
          </span>
          <span
            className={`text-label-sm ${
              referenteError ? 'text-error' : 'text-text-secondary'
            }`}
          >
            {referenteError ?? 'Requerido'}
          </span>
        </span>
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-md border border-divider bg-surface-container-low p-4">
      <div className="flex items-center justify-between">
        <span className="text-body-md font-semibold text-text-primary">
          Referente
        </span>
        <IconButton
          size="small"
          aria-label="Quitar referente"
          onClick={() => {
            limpiar()
            setAbiertoManual(false)
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </div>

      <ToggleButtonGroup
        exclusive
        fullWidth
        size="small"
        color="primary"
        value={modo}
        onChange={(_, value) => value && cambiarModo(value)}
      >
        <ToggleButton value="elegir">Elegir existente</ToggleButton>
        <ToggleButton value="crear">Crear nuevo</ToggleButton>
      </ToggleButtonGroup>

      {modo === 'elegir' ? (
        <Controller
          name="referente_id"
          control={control}
          render={({ field, fieldState: { error } }) => {
            const selected =
              referentes?.find((r) => r.id === field.value) ?? null
            return (
              <FieldShell label="Buscar referente" error={error?.message}>
                <Autocomplete
                  options={referentes ?? []}
                  loading={isFetching}
                  value={selected}
                  getOptionLabel={(option) => option.nombreApellido}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onInputChange={(_, value) => setBusqueda(value)}
                  onChange={(_, option) => seleccionarExistente(option)}
                  noOptionsText="Sin referentes"
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Nombre del referente" />
                  )}
                />
              </FieldShell>
            )
          }}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <Controller
            name="nuevo_referente.nombre_apellido"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FieldShell label="Nombre y apellido" error={error?.message}>
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  placeholder="Nombre del referente"
                  error={Boolean(error)}
                  fullWidth
                />
              </FieldShell>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="nuevo_referente.cedula"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FieldShell label="Cédula" error={error?.message}>
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    placeholder="1234567"
                    error={Boolean(error)}
                    fullWidth
                    slotProps={{ htmlInput: { inputMode: 'numeric' } }}
                  />
                </FieldShell>
              )}
            />
            <Controller
              name="nuevo_referente.celular"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FieldShell label="Celular" error={error?.message}>
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    placeholder="09XXXXXXXX"
                    error={Boolean(error)}
                    fullWidth
                    slotProps={{ htmlInput: { inputMode: 'numeric' } }}
                  />
                </FieldShell>
              )}
            />
          </div>

          {/* Barrio compartido (espejo con el form del votante, §1.4). */}
          <BarrioSelect label="Barrio del referente" />

          <Controller
            name="nuevo_referente.sector_id"
            control={control}
            render={({ field }) => {
              const selected =
                sectores?.find((s) => s.id === field.value) ?? null
              return (
                <FieldShell label="Sector">
                  <Autocomplete
                    options={sectores ?? []}
                    value={selected}
                    getOptionLabel={(option) => option.denominacion}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(_, option) => field.onChange(option?.id)}
                    noOptionsText="Sin sectores"
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Seleccione sector" />
                    )}
                  />
                </FieldShell>
              )
            }}
          />

          <Controller
            name="nuevo_referente.afiliacion"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(field.value)}
                    onChange={(_, checked) => field.onChange(checked)}
                  />
                }
                label="Afiliado"
              />
            )}
          />
        </div>
      )}
    </div>
  )
}
