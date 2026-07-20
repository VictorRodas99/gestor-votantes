import type { ReactNode } from 'react'

/**
 * Encabezado de sección del wizard. Solo aparece en tablet/desktop
 */
export default function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="hidden text-headline-md font-semibold text-text-primary md:block">
      {children}
    </h2>
  )
}
