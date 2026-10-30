import { Link } from 'react-router-dom'
import { MapPinIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { Sede } from '@/lib/api'

export default function OtherSedes({ sedes, currentId }: { sedes: Sede[]; currentId: number }) {
  if (sedes.length < 2) return null

  return (
    <section className="px-4 pb-28 pt-4 sm:px-6 lg:px-8">
      <h2 className="text-center font-display text-2xl font-bold text-dark sm:text-3xl">¿Buscabas otra sede?</h2>
      <ul className="mx-auto mt-6 flex max-w-5xl gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
        {sedes.map((sede) => {
          const isCurrent = sede.id === currentId
          return (
            <li key={sede.id} className="shrink-0">
              <Link
                to={`/sede/${sede.id}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  isCurrent
                    ? 'border-secondary bg-secondary text-white'
                    : 'border-dark/10 bg-white/70 text-dark hover:border-secondary/40 hover:text-secondary'
                )}
              >
                <MapPinIcon size={14} weight="fill" aria-hidden="true" />
                {sede.nombre}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
