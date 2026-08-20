import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import { useState, type MouseEvent } from 'react'
import type { RangoCustom, RangoPreset } from '../lib/rango-fechas'

export type ViviendasFilterValue = {
  preset: RangoPreset
  /** Solo cuando `preset === 'personalizado'`. Fechas `YYYY-MM-DD`. */
  custom?: RangoCustom
}

type ViviendasFilterBarProps = {
  value: ViviendasFilterValue
  onChange: (value: ViviendasFilterValue) => void
}

const PRESETS: { value: Exclude<RangoPreset, 'personalizado'>; label: string }[] =
  [
    { value: 'hoy', label: 'Hoy' },
    { value: 'ultimos7', label: 'Últimos 7 días' },
    { value: 'mes', label: 'Este mes' }
  ]

function chipClass(active: boolean): string {
  return `shrink-0 rounded-full px-4 ${active ? 'border-primary' : 'border-divider text-text-primary'}`
}

/** `2026-06-01` → `01/06` (sin `Date`, para no correrse de día por zona horaria). */
function ddmm(ymd: string): string {
  const [, mes, dia] = ymd.split('-')
  return `${dia}/${mes}`
}

function ViviendasFilterBar({ value, onChange }: ViviendasFilterBarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [desde, setDesde] = useState(value.custom?.desde ?? '')
  const [hasta, setHasta] = useState(value.custom?.hasta ?? '')

  const abrir = (event: MouseEvent<HTMLButtonElement>) => {
    setDesde(value.custom?.desde ?? '')
    setHasta(value.custom?.hasta ?? '')
    setAnchorEl(event.currentTarget)
  }
  const cerrar = () => setAnchorEl(null)

  const rangoValido = desde !== '' && hasta !== '' && desde <= hasta
  const personalizadoActivo = value.preset === 'personalizado'

  const aplicarRango = () => {
    if (!rangoValido) return
    onChange({ preset: 'personalizado', custom: { desde, hasta } })
    cerrar()
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {PRESETS.map((preset) => {
        const active = value.preset === preset.value
        return (
          <Button
            key={preset.value}
            variant={active ? 'contained' : 'outlined'}
            color={active ? 'primary' : 'inherit'}
            onClick={() => onChange({ preset: preset.value })}
            className={chipClass(active)}
          >
            {preset.label}
          </Button>
        )
      })}

      <Button
        variant={personalizadoActivo ? 'contained' : 'outlined'}
        color={personalizadoActivo ? 'primary' : 'inherit'}
        onClick={abrir}
        className={chipClass(personalizadoActivo)}
      >
        {personalizadoActivo && value.custom
          ? `${ddmm(value.custom.desde)}–${ddmm(value.custom.hasta)}`
          : 'Rango…'}
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={cerrar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <div className="flex w-64 flex-col gap-3 p-4">
          <TextField
            type="date"
            label="Desde"
            value={desde}
            onChange={(event) => setDesde(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
          <TextField
            type="date"
            label="Hasta"
            value={hasta}
            onChange={(event) => setHasta(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={aplicarRango}
            disabled={!rangoValido}
          >
            Aplicar
          </Button>
        </div>
      </Popover>
    </div>
  )
}

export default ViviendasFilterBar
