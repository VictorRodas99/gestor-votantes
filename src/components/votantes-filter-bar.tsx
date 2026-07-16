import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState, type MouseEvent } from 'react'
import { ESTADO_OPTIONS, type EstadoValue } from '../constants/votante'
import { useLocalesVotacion } from '../hooks/services/catalogos'
import { truncate } from '../lib/format'

export type VotantesFilterValue = {
  localVotacionId?: number
  estado?: EstadoValue
}

type VotantesFilterBarProps = {
  value: VotantesFilterValue
  onChange: (value: VotantesFilterValue) => void
}

type FilterMenuProps = {
  label: string
  /** Etiqueta de la selección activa (o `label` si no hay nada elegido). */
  selectedLabel?: string
  active: boolean
  children: (close: () => void) => React.ReactNode
}

function FilterMenu({
  label,
  selectedLabel,
  active,
  children
}: FilterMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const openMenu = (event: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)
  const close = () => setAnchorEl(null)

  return (
    <>
      <Button
        variant="outlined"
        color={active ? 'primary' : 'inherit'}
        endIcon={<ArrowDropDownRoundedIcon />}
        onClick={openMenu}
        className={`shrink-0 rounded-full px-4 ${active ? 'border-primary text-primary' : 'border-divider text-text-primary'}`}
      >
        {selectedLabel ?? label}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={close}>
        {children(close)}
      </Menu>
    </>
  )
}

function VotantesFilterBar({ value, onChange }: VotantesFilterBarProps) {
  const { data: locales } = useLocalesVotacion()

  const selectedLocal = locales?.find((l) => l.id === value.localVotacionId)
  const selectedEstado = ESTADO_OPTIONS.find((e) => e.value === value.estado)

  const MAX_LENGTH_LABEL = 10

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      <FilterMenu
        label="Local"
        selectedLabel={
          selectedLocal
            ? truncate(selectedLocal.denominacion, MAX_LENGTH_LABEL)
            : undefined
        }
        active={value.localVotacionId !== null}
      >
        {(close) => [
          <MenuItem
            key="todos"
            onClick={() => {
              onChange({ ...value, localVotacionId: undefined })
              close()
            }}
          >
            Todos los locales
          </MenuItem>,
          ...(locales ?? []).map((local) => (
            <MenuItem
              key={local.id}
              selected={local.id === value.localVotacionId}
              onClick={() => {
                onChange({ ...value, localVotacionId: local.id })
                close()
              }}
            >
              {local.denominacion}
            </MenuItem>
          ))
        ]}
      </FilterMenu>

      <FilterMenu
        label="Estado"
        selectedLabel={
          selectedEstado
            ? truncate(selectedEstado.label, MAX_LENGTH_LABEL)
            : undefined
        }
        active={value.estado !== null}
      >
        {(close) => [
          <MenuItem
            key="todos"
            onClick={() => {
              onChange({ ...value, estado: undefined })
              close()
            }}
          >
            Todos
          </MenuItem>,
          ...ESTADO_OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === value.estado}
              onClick={() => {
                onChange({ ...value, estado: option.value })
                close()
              }}
            >
              {option.label}
            </MenuItem>
          ))
        ]}
      </FilterMenu>
    </div>
  )
}

export default VotantesFilterBar
