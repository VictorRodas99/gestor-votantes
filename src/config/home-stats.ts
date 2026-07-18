import type { SvgIconComponent } from '@mui/icons-material'
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined'
import DirectionsWalkRounded from '@mui/icons-material/DirectionsWalkRounded'
import HowToRegRounded from '@mui/icons-material/HowToRegRounded'
import HowToVoteOutlined from '@mui/icons-material/HowToVoteOutlined'

export type HomeStat = {
  key: string
  label: string
  /** Placeholder (0) hasta wire del reporte real (ver notes/api/pendientes-server.md). */
  value: number
  Icon: SvgIconComponent
  /** Tendencia opcional; placeholder '—' hasta tener datos reales. */
  trend?: string
}

export const homeStats: HomeStat[] = [
  {
    key: 'cargados',
    label: 'Cargados',
    value: 0,
    Icon: CloudUploadOutlined,
    trend: '—'
  },
  {
    key: 'votoSeguro',
    label: 'Voto Seguro',
    value: 0,
    Icon: HowToVoteOutlined,
    trend: '—'
  },
  {
    key: 'visitados',
    label: 'Visitados',
    value: 0,
    Icon: DirectionsWalkRounded,
    trend: '—'
  },
  {
    key: 'afiliados',
    label: 'Afiliados',
    value: 0,
    Icon: HowToRegRounded,
    trend: '—'
  }
]
