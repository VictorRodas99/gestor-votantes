import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'

function ViviendaCardSkeleton() {
  return (
    <Card>
      <Skeleton variant="rectangular" className="h-48 w-full" />
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <Skeleton variant="text" className="text-body-md" width="55%" />
          <Skeleton variant="text" className="text-label-md" width={72} />
        </div>
        <Skeleton variant="text" className="text-body-md" width="100%" />
        <Skeleton variant="text" className="text-body-md" width="80%" />
      </div>
    </Card>
  )
}

export default ViviendaCardSkeleton
