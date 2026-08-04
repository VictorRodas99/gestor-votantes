import type { SvgIconComponent } from '@mui/icons-material'
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined'
import DirectionsWalkRounded from '@mui/icons-material/DirectionsWalkRounded'
import HowToRegRounded from '@mui/icons-material/HowToRegRounded'
import HowToVoteOutlined from '@mui/icons-material/HowToVoteOutlined'
import type { ResumenCampana } from '../types/resumen'

export type HomeStat = {
  /** Campo del resumen (`/info`) del que sale el valor. */
  key: keyof ResumenCampana
  label: string
  Icon: SvgIconComponent
  // `/info` no devuelve serie temporal, no hay con qué calcular la tendencia.
  // trend?: string
}

export const homeStats: HomeStat[] = [
  { key: 'cargados', label: 'Cargados', Icon: CloudUploadOutlined },
  { key: 'votoSeguro', label: 'Voto Seguro', Icon: HowToVoteOutlined },
  { key: 'visitados', label: 'Visitados', Icon: DirectionsWalkRounded },
  { key: 'afiliados', label: 'Afiliados', Icon: HowToRegRounded }
]
