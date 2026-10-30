import { Link } from 'react-router-dom'
import { ArrowLeftIcon, MapPinIcon } from '@phosphor-icons/react'
import PatternOverlay from '../ui/PatternOverlay'
import type { Sede } from '@/lib/api'

export default function SedeHero({ sede }: { sede: Sede }) {
  return (
    <section className="relative overflow-hidden bg-primary px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8">
      <PatternOverlay className="bg-white opacity-[0.15]" tileWidth={380} />

      <div className="relative mx-auto max-w-5xl space-y-4">
        <Link
          to="/sedes"
          className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ArrowLeftIcon size={16} weight="bold" aria-hidden="true" />
          Todas las sedes
        </Link>

        <div className="space-y-2 pt-2">
          {sede.ciudad && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Sede {sede.ciudad}</p>
          )}
          <h1 className="text-balance font-display text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            {sede.nombre}
          </h1>
        </div>

        <p className="flex items-start gap-2 text-sm text-white/90 sm:text-base">
          <MapPinIcon size={20} weight="fill" className="mt-0.5 shrink-0" aria-hidden="true" />
          {sede.direccion}
        </p>
      </div>
    </section>
  )
}
