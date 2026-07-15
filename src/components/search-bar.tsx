import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import InputAdornment from '@mui/material/InputAdornment'
import type { TextFieldProps } from '@mui/material/TextField'
import TextField from '@mui/material/TextField'

type SearchBarProps = {
  placeholder?: string
} & Pick<TextFieldProps, 'value' | 'onChange'>

/**
 * Buscador reutilizable (campo con ícono de lupa). El estilo del input
 * (bordes redondeados + fondo blanco) vive en el tema (MuiTextField), no aquí.
 */
function SearchBar({
  placeholder = 'Buscar',
  value,
  onChange
}: SearchBarProps) {
  return (
    <TextField
      fullWidth
      type="search"
      placeholder={placeholder}
      aria-label={placeholder}
      value={value}
      onChange={onChange}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon className="text-text-secondary" />
            </InputAdornment>
          )
        }
      }}
    />
  )
}

export default SearchBar
