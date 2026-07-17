import TextField from '@mui/material/TextField'
import type { ReactNode } from 'react'
import {
  Controller,
  useFormContext,
  type ControllerProps,
  type Path
} from 'react-hook-form'
import type { WizardFormData } from '../../forms/votante/wizard.schema'

type FieldName = Path<WizardFormData>

/**
 * Contenedor visual de un campo: etiqueta en negrita arriba + control + error
 * abajo (tal como el diseño, notes/design/images/wizard/paso-uno.png).
 * Reutilizado por FormField y por los campos custom (sexo, barrio, referente).
 */
export function FieldShell({
  label,
  htmlFor,
  error,
  children
}: {
  label?: string
  htmlFor?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-label-md font-semibold text-text-primary"
        >
          {label}
        </label>
      )}
      {children}
      {error && <span className="text-label-sm text-error">{error}</span>}
    </div>
  )
}

type FormFieldProps = {
  name: FieldName
  label?: string
  placeholder?: string
  type?: string
  disabled?: boolean
  numeric?: boolean
  multiline?: boolean
  minRows?: number
  render?: ControllerProps<WizardFormData>['render']
}

/**
 * Campo de texto enlazado a React Hook Form vía `useFormContext`. Para controles
 * no estándar pasar `render` (recibe `field` + `fieldState`).
 */
export default function FormField({
  name,
  label,
  placeholder,
  type = 'text',
  disabled,
  numeric,
  multiline,
  minRows = 4,
  render
}: FormFieldProps) {
  const { control } = useFormContext<WizardFormData>()

  return (
    <Controller
      name={name}
      control={control}
      render={
        render ??
        (({ field, fieldState: { error } }) => (
          <FieldShell label={label} htmlFor={name} error={error?.message}>
            <TextField
              {...field}
              id={name}
              value={field.value ?? ''}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              multiline={multiline}
              minRows={multiline ? minRows : undefined}
              error={Boolean(error)}
              fullWidth
              onChange={
                numeric
                  ? (event) => {
                      const digitos = event.target.value.replace(/\D/g, '')
                      field.onChange(
                        digitos === '' ? undefined : Number(digitos)
                      )
                    }
                  : field.onChange
              }
              slotProps={
                numeric ? { htmlInput: { inputMode: 'numeric' } } : undefined
              }
            />
          </FieldShell>
        ))
      }
    />
  )
}
