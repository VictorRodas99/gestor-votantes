import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

export type AsignacionTab = 'punteros' | 'brigadas'

type AsignacionTabsProps = {
  value: AsignacionTab
  onChange: (tab: AsignacionTab) => void
}

/** Tabs planas full-width con indicator (diseño §0), ligadas a `?tab=`. */
function AsignacionTabs({ value, onChange }: AsignacionTabsProps) {
  return (
    <Tabs
      value={value}
      onChange={(_, tab: AsignacionTab) => onChange(tab)}
      variant="fullWidth"
      className="sticky top-0 z-10 border-b border-divider bg-surface"
    >
      <Tab value="punteros" label="Punteros" />
      <Tab value="brigadas" label="Brigadas" />
    </Tabs>
  )
}

export default AsignacionTabs
