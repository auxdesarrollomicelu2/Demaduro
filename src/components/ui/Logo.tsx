import { cn } from '@/lib/utils'
import logo from '@/assets/images/demaduro.png'

interface LogoProps {
  className?: string
  alt?: string
}

/**
 * Logo circular de Demaduro.
 * La imagen trae margen transparente alrededor del círculo (ocupa ~48% del lienzo),
 * por eso se amplía dentro de un contenedor redondo para que el círculo lo llene.
 * El tamaño se controla desde fuera con className (ej: "h-10 w-10").
 */
export default function Logo({ className, alt = '' }: LogoProps) {
  return (
    <span className={cn('block shrink-0 overflow-hidden rounded-full bg-primary', className)}>
      <img
        src={logo}
        alt={alt}
        width={1280}
        height={1275}
        className="h-full w-full scale-[2.08] object-contain"
      />
    </span>
  )
}
