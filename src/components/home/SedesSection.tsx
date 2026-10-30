import { Link } from 'react-router-dom'
import { getActiveSedes } from '../../lib/api'
import { useAsyncData } from '../../hooks/useAsyncData'
import Card from '../ui/Card'
import LoadError from '../ui/LoadError'
import PatternOverlay from '../ui/PatternOverlay'

export default function SedesSection() {
  const { data, status, reload } = useAsyncData(getActiveSedes)
  const sedes = data ?? []

  return (
    <section className="relative overflow-hidden py-12 px-4 sm:py-16 sm:px-6 lg:px-8 bg-[#FCFAF7]">
      <PatternOverlay className="bg-accent opacity-90" tileWidth={400} />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 space-y-3">
          <p className="text-primary font-bold text-xs sm:text-sm uppercase tracking-[0.2em]">
            Nuestras sedes
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-dark">
            Busca tu sede más cercana
          </h2>
          <p className="text-base sm:text-lg text-dark-light max-w-2xl mx-auto">
            Toca tu sede para ver la ubicación y pedir tu domicilio directo por WhatsApp.
          </p>
        </div>

        {/* Cargando */}
        {status === 'loading' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" aria-busy="true" aria-label="Cargando sedes">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-48 rounded-2xl bg-white/60 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {status === 'error' && <LoadError title="No pudimos cargar las sedes" onRetry={reload} />}

        {/* Sin sedes */}
        {status === 'success' && sedes.length === 0 && (
          <div className="mx-auto max-w-md rounded-2xl bg-white/70 border border-dark/[0.07] p-6 sm:p-8 text-center space-y-2">
            <p className="text-3xl" aria-hidden="true">🍌</p>
            <p className="text-dark font-semibold">Muy pronto verás nuestras sedes aquí</p>
            <p className="text-sm text-dark-light">Estamos preparando todo para llevarte el sabor de la abuela.</p>
          </div>
        )}

        {/* Sedes Grid */}
        {status === 'success' && sedes.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {sedes.map((sede) => (
              <Link
                key={sede.id}
                to={`/sede/${sede.id}`}
                className="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Card variant="soft" padding="sm" className="flex h-full flex-col sm:p-5 group-hover:-translate-y-1 transition-transform duration-200">
                  <div className="flex flex-1 flex-col">
                    {/* Icon */}
                    <div className="mb-4 w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>

                    {/* City */}
                    {sede.ciudad && (
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-secondary">
                        {sede.ciudad}
                      </p>
                    )}

                    {/* Name */}
                    <h3 className="font-display text-xl font-bold leading-tight text-dark line-clamp-2">
                      {sede.nombre}
                    </h3>

                    {/* Address */}
                    <p className="mt-2 text-sm leading-relaxed text-dark/60 line-clamp-2">
                      {sede.direccion}
                    </p>

                    {/* CTA */}
                    <div className="mt-auto flex items-center gap-2 pt-4 text-primary-dark font-bold text-sm">
                      <span>Pedir aquí</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
