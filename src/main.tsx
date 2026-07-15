import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Inter drives the "Civic Vanguard" typography; Roboto is the fallback family.
// Variable fonts: one import each covers the full weight axis.
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/roboto/index.css'
import App from './app.tsx'
import './index.css'
import theme from './theme.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>
)
