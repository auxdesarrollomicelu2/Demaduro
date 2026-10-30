import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import gridPattern from '@/assets/images/blancas_grid.png'

interface PatternOverlayProps {
  className?: string
  tileWidth?: number
}

/**
 * Patrón de baldosas decorativo de Demaduro.
 * La imagen se usa como máscara: el color del patrón lo define className (ej: "bg-white opacity-20"),
 * así un solo archivo sirve sobre fondos crema, naranja o verde.
 * El contenedor padre debe tener "relative" y "overflow-hidden".
 */
export default function PatternOverlay({ className, tileWidth = 400 }: PatternOverlayProps) {
  const maskStyle: CSSProperties = {
    maskImage: `url(${gridPattern})`,
    WebkitMaskImage: `url(${gridPattern})`,
    maskSize: `${tileWidth}px auto`,
    WebkitMaskSize: `${tileWidth}px auto`,
    maskRepeat: 'repeat',
    WebkitMaskRepeat: 'repeat',
  }

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0', className)}
      style={maskStyle}
    />
  )
}
