import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { toast } from 'sonner'
import type { WizardFormData } from '../../forms/votante/wizard.schema'
import { FieldShell } from './form-field'

export default function CodigoField() {
  const { control } = useFormContext<WizardFormData>()
  const [copiado, setCopiado] = useState(false)

  const copiar = async (codigo: string) => {
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
    <Controller
      name="codigo"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FieldShell
          label="Código Único"
          htmlFor="codigo"
          error={error?.message}
        >
          <TextField
            {...field}
            id="codigo"
            value={field.value ?? ''}
            error={Boolean(error)}
            fullWidth
            slotProps={{
              htmlInput: {
                readOnly: true,
                className: 'font-mono tracking-wider'
              },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={copiado ? 'Copiado' : 'Copiar código'}>
                      <IconButton
                        edge="end"
                        size="small"
                        aria-label="Copiar código único"
                        onClick={() => copiar(String(field.value ?? ''))}
                      >
                        {copiado ? (
                          <CheckRoundedIcon fontSize="small" />
                        ) : (
                          <ContentCopyRoundedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }
            }}
          />
        </FieldShell>
      )}
    />
  )
}
