import { useParams } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import SedeHero from '../components/sede/SedeHero'
import SedeContact from '../components/sede/SedeContact'
import SedeMap from '../components/sede/SedeMap'
import OtherSedes from '../components/sede/OtherSedes'
import LoadError from '../components/ui/LoadError'
import { ButtonLink } from '../components/ui/Button'
import { getActiveSedes } from '../lib/api'
import { mapEmbedUrl } from '../lib/maps'
import { useAsyncData } from '../hooks/useAsyncData'
import { cn } from '../lib/utils'

export default function SedePage() {
  const { sedeId } = useParams()
  const { data, status, reload } = useAsyncData(getActiveSedes)
  const sedes = data ?? []
  const sede = sedes.find((s) => s.id === Number(sedeId))
  const embedUrl = sede ? mapEmbedUrl(sede) : null

  return (
    <PageLayout>
      {status === 'loading' && (
        <div aria-busy="true" aria-label="Cargando sede">
          <div className="h-72 animate-pulse bg-primary/40" />
          <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8">
            <div className="h-80 animate-pulse rounded-3xl bg-white/60" />
            <div className="h-80 animate-pulse rounded-3xl bg-white/60" />
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="px-4 pb-16 pt-28">
          <LoadError title="No pudimos cargar la sede" onRetry={reload} />
        </div>
      )}

      {status === 'success' && !sede && (
        <div className="px-4 pb-16 pt-28">
          <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-dark/[0.07] bg-white/70 p-6 text-center sm:p-8">
            <p className="text-4xl" aria-hidden="true">📍</p>
            <p className="font-semibold text-dark">No encontramos esta sede</p>
            <p className="text-sm text-dark-light">Puede que ya no esté disponible. Elige otra sede cercana.</p>
            <ButtonLink to="/sedes" variant="secondary" size="sm">
              Ver todas las sedes
            </ButtonLink>
          </div>
        </div>
      )}

      {status === 'success' && sede && (
        <>
          <SedeHero sede={sede} />

          <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className={cn('mx-auto grid gap-6', embedUrl ? 'max-w-5xl md:grid-cols-2' : 'max-w-md')}>
              <SedeContact sede={sede} />
              {embedUrl && <SedeMap sede={sede} embedUrl={embedUrl} />}
            </div>
          </section>

          <OtherSedes sedes={sedes} currentId={sede.id} />
        </>
      )}
    </PageLayout>
  )
}
