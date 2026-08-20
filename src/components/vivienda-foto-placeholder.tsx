import MapsHomeWorkRoundedIcon from '@mui/icons-material/MapsHomeWorkRounded'

type ViviendaFotoPlaceholderProps = {
  className?: string
}

function ViviendaFotoPlaceholder({ className }: ViviendaFotoPlaceholderProps) {
  return (
    <div
      className={`flex w-full items-center justify-center bg-surface-container ${className ?? ''}`}
    >
      <MapsHomeWorkRoundedIcon className="size-16 text-text-secondary" />
    </div>
  )
}

export default ViviendaFotoPlaceholder
