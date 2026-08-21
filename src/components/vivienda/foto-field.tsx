import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import imageCompression from 'browser-image-compression'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { toast } from 'sonner'
import {
  MAX_FOTO_BYTES,
  TIPOS_IMAGEN,
  type ViviendaFormData
} from '../../forms/vivienda/vivienda.schema'
import { FieldShell } from '../wizard/form-field'

// comprimir client side porque las fotos de las cámaras pueden ser muy pesadas
const OPCIONES_COMPRESION = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1600,
  useWebWorker: true
}

export default function FotoField() {
  const { control } = useFormContext<ViviendaFormData>()
  const { field, fieldState } = useController({ name: 'foto', control })
  const file = field.value
  const [dragActive, setDragActive] = useState(false)
  const [procesando, setProcesando] = useState(false)

  const galeriaRef = useRef<HTMLInputElement>(null)
  const camaraRef = useRef<HTMLInputElement>(null)

  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  )
  // Revoca el object URL al cambiar de archivo y al desmontar.
  useEffect(() => {
    if (!preview) return
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  const validarYSetear = async (elegido: File | undefined) => {
    if (!elegido) return

    if (!TIPOS_IMAGEN.includes(elegido.type as (typeof TIPOS_IMAGEN)[number])) {
      toast.error('Formato no permitido. Usá JPG, PNG o WEBP.')
      return
    }

    setProcesando(true)
    try {
      const comprimido = await imageCompression(elegido, OPCIONES_COMPRESION)

      const archivo = new File([comprimido], elegido.name, {
        type: comprimido.type || elegido.type,
        lastModified: Date.now()
      })

      // gurdia por si comprimir no comprime menor a 2MB igual
      if (archivo.size > MAX_FOTO_BYTES) {
        toast.error('La imagen supera los 2 MB aún comprimida. Probá con otra.')
        return
      }
      field.onChange(archivo)
    } catch {
      toast.error('No pudimos procesar la imagen. Probá con otra.')
    } finally {
      setProcesando(false)
    }
  }

  const quitar = () => {
    field.onChange(undefined)
    if (galeriaRef.current) galeriaRef.current.value = ''
    if (camaraRef.current) camaraRef.current.value = ''
  }

  return (
    <FieldShell label="Foto de vivienda" error={fieldState.error?.message}>
      <input
        ref={galeriaRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => validarYSetear(event.target.files?.[0])}
      />
      <input
        ref={camaraRef}
        type="file"
        accept="image/*"
        capture="environment"
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
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={procesando}
            onClick={() => galeriaRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDragActive(false)
              if (!procesando) validarYSetear(event.dataTransfer.files?.[0])
            }}
            className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-10 text-center transition-colors disabled:opacity-60 ${
              dragActive ? 'border-primary bg-primary/5' : 'border-divider'
            }`}
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-contrast lg:size-16">
              {procesando ? (
                <CircularProgress size={24} className="text-primary-contrast" />
              ) : (
                <AddPhotoAlternateRoundedIcon className="size-7 lg:size-8" />
              )}
            </span>
            <span className="text-body-md font-semibold text-text-primary">
              {procesando ? (
                'Procesando imagen…'
              ) : (
                <>
                  <span className="hidden lg:inline">
                    Arrastre una imagen o haga clic para subir
                  </span>
                  <span className="lg:hidden">Toca para elegir de galería</span>
                </>
              )}
            </span>
            <span className="text-label-sm text-text-secondary">
              JPG, PNG o WEBP · máx. 2 MB
            </span>
          </button>

          <button
            type="button"
            disabled={procesando}
            onClick={() => camaraRef.current?.click()}
            className="text-label-lg flex items-center justify-center gap-2 rounded-lg border border-divider px-4 py-3 font-semibold text-text-primary transition-colors disabled:opacity-60 lg:hidden"
          >
            <PhotoCameraRoundedIcon className="size-5" />
            Tomar foto
          </button>
        </div>
      )}
    </FieldShell>
  )
}
