import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import IconButton from '@mui/material/IconButton'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { toast } from 'sonner'
import {
  MAX_FOTO_BYTES,
  TIPOS_IMAGEN,
  type ViviendaFormData
} from '../../forms/vivienda/vivienda.schema'
import { FieldShell } from '../wizard/form-field'

export default function FotoField() {
  const { control } = useFormContext<ViviendaFormData>()
  const { field, fieldState } = useController({ name: 'foto', control })
  const file = field.value
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  )
  // Revoca el object URL al cambiar de archivo y al desmontar.
  useEffect(() => {
    if (!preview) return
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  const validarYSetear = (elegido: File | undefined) => {
    if (!elegido) return

    if (!TIPOS_IMAGEN.includes(elegido.type as (typeof TIPOS_IMAGEN)[number])) {
      toast.error('Formato no permitido. Usá JPG, PNG o WEBP.')
      return
    }
    if (elegido.size > MAX_FOTO_BYTES) {
      toast.error('La imagen supera los 5 MB.')
      return
    }
    field.onChange(elegido)
  }

  const quitar = () => {
    field.onChange(undefined)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <FieldShell label="Foto de vivienda" error={fieldState.error?.message}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => validarYSetear(event.target.files?.[0])}
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-lg border border-divider">
          <img
            src={preview}
            alt="Vista previa de la vivienda"
            className="max-h-72 w-full object-cover"
          />
          <IconButton
            onClick={quitar}
            aria-label="Quitar foto"
            size="small"
            className="absolute top-2 right-2 bg-surface-container-lowest/90"
          >
            <CloseRoundedIcon />
          </IconButton>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragActive(false)
            validarYSetear(event.dataTransfer.files?.[0])
          }}
          className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-10 text-center transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-divider'
          }`}
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-contrast lg:size-16">
            <AddPhotoAlternateRoundedIcon className="size-7 lg:size-8" />
          </span>
          <span className="text-body-md font-semibold text-text-primary">
            <span className="hidden lg:inline">
              Arrastre una imagen o haga clic para subir
            </span>
            <span className="lg:hidden">Toca para subir o tomar foto</span>
          </span>
          <span className="text-label-sm text-text-secondary">
            JPG, PNG o WEBP · máx. 5 MB
          </span>
        </button>
      )}
    </FieldShell>
  )
}
