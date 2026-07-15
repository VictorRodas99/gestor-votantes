import { createTheme } from '@mui/material/styles'

// Design system: "Civic Vanguard" (see notes/design/index.md).
// Trust + civic duty, with an energetic gold accent. Built for high-contrast,
// large-touch-target field use during campaign work.
//
// `cssVariables: true` makes MUI emit its theme as `--mui-*` CSS custom
// properties on :root, which the Tailwind `@theme inline` block in index.css
// maps into Tailwind tokens (bg-primary, text-secondary, …).
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    // Civic Blue — institutional structure, headers, primary CTAs.
    primary: {
      main: '#004787',
      light: '#1e5fa8',
      dark: '#00325e',
      contrastText: '#ffffff'
    },
    // Vibrant Gold — the energetic accent: "starring" voters, highlights.
    secondary: {
      main: '#feb316',
      light: '#ffba3b',
      dark: '#7f5700',
      contrastText: '#6a4800'
    },
    error: {
      main: '#ba1a1a',
      dark: '#93000a',
      contrastText: '#ffffff'
    },
    // Pending / "needs transport" — mirrors the gold accent.
    warning: {
      main: '#feb316',
      dark: '#6a4800',
      contrastText: '#6a4800'
    },
    info: {
      main: '#1e5fa8',
      contrastText: '#ffffff'
    },
    success: {
      main: '#146c2e',
      dark: '#0b5121',
      contrastText: '#ffffff'
    },
    background: {
      // Slightly off-white canvas to reduce glare in the field.
      default: '#f6f9ff',
      // Cards/containers use pure white to "pop" off the page.
      paper: '#ffffff'
    },
    text: {
      primary: '#151c23',
      secondary: '#424751',
      disabled: '#727782'
    },
    divider: '#c2c6d3'
  },
  // 8px default radius (buttons/inputs); cards use 12px via `rounded-md`.
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily:
      '"Inter Variable", "Roboto Variable", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    // headline-lg
    h4: {
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: '38px',
      letterSpacing: '-0.02em'
    },
    // headline-lg-mobile
    h5: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: '30px',
      letterSpacing: '-0.01em'
    },
    // headline-md
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: '28px'
    },
    // body-lg
    body1: {
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: '26px'
    },
    // body-md
    body2: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '24px'
    },
    // label-md
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: '20px',
      letterSpacing: '0.01em'
    },
    // label-sm
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: '16px',
      letterSpacing: '0.04em'
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.01em',
      textTransform: 'none'
    }
  },
  // Defaults compartidos: evitan repetir sx/className en cada instancia.
  components: {
    // Tarjetas: sin sombra de MUI; usan borde 1px + sombra de tarjeta y radio 12px.
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid var(--mui-palette-divider)',
          boxShadow: 'var(--shadow-card)'
        }
      }
    },
    // Inputs de texto: fondo blanco (paper) y radio 8px, como el buscador del Inicio.
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'var(--mui-palette-background-paper)'
          }
        }
      }
    }
  }
})

export default theme
