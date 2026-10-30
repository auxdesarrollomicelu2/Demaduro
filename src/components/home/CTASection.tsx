import { ButtonLink } from '../ui/Button'
import PatternOverlay from '../ui/PatternOverlay'

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-primary">
      <PatternOverlay className="bg-white opacity-[0.15]" tileWidth={380} />

      <div className="relative max-w-5xl mx-auto flex flex-col items-center gap-6 px-4 py-12 text-center sm:px-6 md:flex-row md:justify-between md:gap-10 md:text-left lg:px-8 lg:py-14">
        <div className="max-w-md space-y-2">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Domicilios calienticos <span aria-hidden="true">🛵</span>
          </h2>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            El antojo no espera. Elige tu sede y escríbenos por WhatsApp: te llevamos el sabor de la abuela hasta la puerta.
          </p>
        </div>

        <ButtonLink to="/sedes" variant="dark" size="md" className="w-full shrink-0 sm:w-auto">
          Elegir mi sede
        </ButtonLink>
      </div>
    </section>
  )
}
