import { useState } from 'react'
import ViviendaFotoPlaceholder from './vivienda-foto-placeholder'

type ViviendaFotoProps = {
  foto: string
  alt: string
  className: string
}

function ViviendaFoto({ foto, alt, className }: ViviendaFotoProps) {
  const [rota, setRota] = useState(false)

  if (foto === '' || rota) {
    return <ViviendaFotoPlaceholder className={className} />
  }

  return (
    <img
      src={foto}
      alt={alt}
      onError={() => setRota(true)}
      className={`w-full object-cover ${className}`}
    />
  )
}

export default ViviendaFoto
