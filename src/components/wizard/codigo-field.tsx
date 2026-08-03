import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import { codigoDesdeCedula, formatearCodigo } from '../../lib/codigo'
import { FieldShell } from './form-field'

export default function CodigoField() {
  const { control } = useFormContext<WizardFormData>()
  const cedula = useWatch({ control, name: 'cedula' })
  const [copiado, setCopiado] = useState(false)

  // Derivado de la cédula, no un campo del form: mientras no haya cédula no hay
  // código que mostrar (lib/codigo.ts).
  const codigo = formatearCodigo(codigoDesdeCedula(cedula ?? ''))

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(true)
      toast.success('Código copiado')
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      toast.error('No se pudo copiar')
    }
  }

  return (
    <FieldShell label="Código Único" htmlFor="codigo">
      <TextField
        id="codigo"
        value={codigo}
        placeholder="Se genera con la cédula"
        fullWidth
        slotProps={{
          htmlInput: {
            readOnly: true,
            className: 'font-mono tracking-wider'
          },
          input: {
            endAdornment: codigo ? (
              <InputAdornment position="end">
                <Tooltip title={copiado ? 'Copiado' : 'Copiar código'}>
                  <IconButton
                    edge="end"
                    size="small"
                    aria-label="Copiar código único"
                    onClick={copiar}
                  >
                    {copiado ? (
                      <CheckRoundedIcon fontSize="small" />
                    ) : (
                      <ContentCopyRoundedIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : null
          }
        }}
      />
    </FieldShell>
  )
}
