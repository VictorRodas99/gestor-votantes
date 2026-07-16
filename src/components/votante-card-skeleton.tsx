import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'

function VotanteCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" className="size-14 shrink-0" />
        <div className="flex-1">
          <Skeleton variant="text" className="text-body-lg" width="60%" />
          <Skeleton variant="text" className="text-body-md" width="40%" />
          <div className="mt-1.5 flex gap-2">
            <Skeleton variant="rounded" width={92} height={28} />
            <Skeleton variant="rounded" width={72} height={28} />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default VotanteCardSkeleton
