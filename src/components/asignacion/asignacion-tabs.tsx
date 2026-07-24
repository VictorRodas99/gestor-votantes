import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

export type AsignacionTab = 'punteros' | 'brigadas'

type AsignacionTabsProps = {
  value: AsignacionTab
  onChange: (tab: AsignacionTab) => void
  variant?: 'mobile' | 'desktop'
}

function AsignacionTabs({
  value,
  onChange,
  variant = 'mobile'
}: AsignacionTabsProps) {
  const esDesktop = variant === 'desktop'

  return (
    <Tabs
      value={value}
      onChange={(_, tab: AsignacionTab) => onChange(tab)}
      variant={esDesktop ? 'standard' : 'fullWidth'}
      className={
        esDesktop
          ? 'shrink-0'
          : 'sticky top-0 z-10 border-b border-divider bg-surface'
      }
    >
      <Tab value="punteros" label="Punteros" />
      <Tab value="brigadas" label="Brigadas" />
    </Tabs>
  )
}

export default AsignacionTabs
