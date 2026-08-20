import { zodResolver } from '@hookform/resolvers/zod'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
  Controller,
  FormProvider,
  useForm,
  useFormState
} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import FotoField from '../components/vivienda/foto-field'
import ViviendaUbicacionField from '../components/vivienda/vivienda-ubicacion-field'
import { FieldShell } from '../components/wizard/form-field'
import {
  viviendaSchema,
  type ViviendaFormData
} from '../forms/vivienda/vivienda.schema'
import { useCrearVivienda } from '../hooks/services/viviendas'

const VALORES_INICIALES = { descripcion: '', ubicacion: { calle: '' } }

function ViviendaNuevaPage() {
  const navigate = useNavigate()
  const esDesktop = useMediaQuery('(min-width:1024px)')
  const { mutateAsync, isPending } = useCrearVivienda()

  const form = useForm<ViviendaFormData>({
    resolver: zodResolver(viviendaSchema),
    mode: 'onTouched',
    defaultValues: VALORES_INICIALES
  })

  const { errors } = useFormState({ control: form.control })
  const errorCoords =
    errors.ubicacion?.lat?.message ?? errors.ubicacion?.lng?.message

  const onSubmit = async (data: ViviendaFormData) => {
    try {
      await mutateAsync(data)
      toast.success('Vivienda registrada.')
      form.reset(VALORES_INICIALES)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No pudimos guardar la vivienda.'
      )
    }
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="hidden lg:block">
          <Typography variant="h4" component="h1" className="text-text-primary">
            Nuevo Registro de Vivienda
          </Typography>
          <Typography variant="body2" className="text-text-secondary">
            Ingrese la ubicación y los datos de la vivienda.
          </Typography>
        </div>

        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-12 lg:gap-8 lg:rounded-xl lg:border lg:border-divider lg:bg-surface-container-lowest lg:p-6">
          <div className="flex flex-col gap-5 lg:col-span-7">
            <FotoField />

            {/* En mobile la Ubicación va entre Foto y Dirección */}
            {!esDesktop && <ViviendaUbicacionField errorCoords={errorCoords} />}

            <Controller
              name="ubicacion.calle"
              control={form.control}
              render={({ field, fieldState: { error } }) => (
                <FieldShell
                  label="Dirección"
                  htmlFor="direccion"
                  error={error?.message}
                >
                  <TextField
                    {...field}
                    id="direccion"
                    value={field.value ?? ''}
                    placeholder="Ej: Calle Principal 123, barrio Centro"
                    fullWidth
                    error={Boolean(error)}
                  />
                </FieldShell>
              )}
            />

            <Controller
              name="descripcion"
              control={form.control}
              render={({ field, fieldState: { error } }) => (
                <FieldShell
                  label="Descripción"
                  htmlFor="descripcion"
                  error={error?.message}
                >
                  <p className="text-label-sm text-text-secondary">
                    Detalle color de fachada, referencias visuales, tipo de reja
                    o accesibilidad para brigadistas.
                  </p>
                  <TextField
                    {...field}
                    id="descripcion"
                    value={field.value ?? ''}
                    placeholder="Ej. Casa de dos pisos con fachada blanca y portón negro. Frente a una papelería."
                    multiline
                    minRows={4}
                    fullWidth
                    error={Boolean(error)}
                  />
                </FieldShell>
              )}
            />
          </div>

          {/* Columna derecha mapa persistente (solo desktop) */}
          <aside className="hidden lg:col-span-5 lg:block">
            <div className="lg:sticky lg:top-24">
              {esDesktop && (
                <ViviendaUbicacionField errorCoords={errorCoords} />
              )}
            </div>
          </aside>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:border-t lg:border-divider lg:pt-5">
          <Button
            variant="text"
            size="large"
            onClick={() => navigate('/')}
            className="hidden lg:inline-flex"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            loading={isPending}
            startIcon={<SaveRoundedIcon />}
            className="lg:w-auto lg:min-w-40 lg:flex-none"
          >
            Guardar Registro
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default ViviendaNuevaPage
