import { zodResolver } from '@hookform/resolvers/zod'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { Controller, useForm } from 'react-hook-form'
import {
  punteroSchema,
  type PunteroFormData
} from '../../forms/puntero/puntero.schema'
import { useBarrios, useSectores } from '../../hooks/services/catalogos'
import { FieldShell } from '../wizard/form-field'

type CrearPunteroFormProps = {
  isPending: boolean
  onSubmit: (data: PunteroFormData) => void
}

const DEFAULT_VALUES: PunteroFormData = {
  nombre_apellido: '',
  cedula: '',
  celular: '',
  afiliacion: false,
  barrio_id: undefined,
  sector_id: undefined,
  transporte: ''
}

function CrearPunteroForm({ isPending, onSubmit }: CrearPunteroFormProps) {
  const { control, handleSubmit } = useForm<PunteroFormData>({
    resolver: zodResolver(punteroSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES
  })

  const { data: barrios, isLoading: cargandoBarrios } = useBarrios()
  const { data: sectores } = useSectores()

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <Controller
        name="nombre_apellido"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FieldShell label="Nombre y apellido" error={error?.message}>
            <TextField
              {...field}
              placeholder="Nombre del puntero"
              error={Boolean(error)}
              fullWidth
            />
          </FieldShell>
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <Controller
          name="cedula"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FieldShell label="Cédula" error={error?.message}>
              <TextField
                {...field}
                placeholder="1234567"
                error={Boolean(error)}
                fullWidth
                slotProps={{ htmlInput: { inputMode: 'numeric' } }}
              />
            </FieldShell>
          )}
        />
        <Controller
          name="celular"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FieldShell label="Celular" error={error?.message}>
              <TextField
                {...field}
                placeholder="09XXXXXXXX"
                error={Boolean(error)}
                fullWidth
                slotProps={{ htmlInput: { inputMode: 'numeric' } }}
              />
            </FieldShell>
          )}
        />
      </div>

      <Controller
        name="barrio_id"
        control={control}
        render={({ field, fieldState: { error } }) => {
          const selected = barrios?.find((b) => b.id === field.value) ?? null
          return (
            <FieldShell label="Barrio" error={error?.message}>
              <Autocomplete
                options={barrios ?? []}
                loading={cargandoBarrios}
                value={selected}
                getOptionLabel={(option) => option.denominacion}
                getOptionKey={(option) => option.id}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, option) => field.onChange(option?.id)}
                onBlur={field.onBlur}
                noOptionsText="Sin barrios disponibles"
                renderInput={(params) => (
                  <TextField {...params} placeholder="Seleccione barrio" />
                )}
              />
            </FieldShell>
          )
        }}
      />

      <Controller
        name="sector_id"
        control={control}
        render={({ field }) => {
          const selected = sectores?.find((s) => s.id === field.value) ?? null
          return (
            <FieldShell label="Sector">
              <Autocomplete
                options={sectores ?? []}
                value={selected}
                getOptionLabel={(option) => option.denominacion}
                getOptionKey={(option) => option.id}
                isOptionEqualToValue={(option, value) => option.id === value.id}
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
        name="transporte"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FieldShell label="Transporte (opcional)" error={error?.message}>
            <TextField
              {...field}
              value={field.value ?? ''}
              placeholder="Ej. Camioneta blanca"
              error={Boolean(error)}
              fullWidth
            />
          </FieldShell>
        )}
      />

      <Controller
        name="afiliacion"
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

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isPending}
        startIcon={
          isPending ? (
            <CircularProgress size={18} color="inherit" />
          ) : undefined
        }
      >
        Crear y asignar
      </Button>
    </form>
  )
}

export default CrearPunteroForm
