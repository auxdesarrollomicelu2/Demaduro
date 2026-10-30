import { MapPinIcon } from '@phosphor-icons/react'
import { ButtonAnchor } from '../ui/Button'
import { openInMapsUrl } from '@/lib/maps'
import type { Sede } from '@/lib/api'

export default function SedeMap({ sede, embedUrl }: { sede: Sede; embedUrl: string }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-dark/[0.07] bg-white shadow-lg">
      <iframe
        title={`Mapa de ${sede.nombre}`}
        src={embedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-64 w-full flex-1 border-0 sm:h-72 md:h-auto md:min-h-[18rem]"
      />
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-dark">
          <MapPinIcon size={18} weight="fill" className="text-primary" aria-hidden="true" />
          ¿Cómo llegar?
        </p>
        <ButtonAnchor href={openInMapsUrl(sede)} target="_blank" rel="noopener noreferrer" variant="primary" size="sm">
          Abrir en Maps
        </ButtonAnchor>
      </div>
    </div>
  )
}
