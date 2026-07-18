import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { format } from '@react-input/number-format'
import type { HomeStat } from '../config/home-stats'

type StatCardProps = {
  stat: HomeStat
}

const numberFormat = { locales: 'de-DE', maximumFractionDigits: 0 } as const

function StatCard({ stat }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <Typography
          variant="subtitle2"
          component="span"
          className="text-text-secondary"
        >
          {stat.label}
        </Typography>
        <span className="flex size-10 items-center justify-center rounded-full bg-surface-container text-primary">
          <stat.Icon className="size-5" />
        </span>
      </div>
      <Typography
        variant="h4"
        component="span"
        className="font-bold text-text-primary"
      >
        {format(stat.value, numberFormat)}
      </Typography>
      {stat.trend ? (
        <Typography
          variant="caption"
          component="span"
          className="text-text-secondary"
        >
          {stat.trend}
        </Typography>
      ) : null}
    </Card>
  )
}

export default StatCard
