import { TextAlignLeftIcon } from '@phosphor-icons/react'
import { ButtonLink } from '../ui/Button'
import Badge from '../ui/Badge'
import Logo from '../ui/Logo'
import PatternOverlay from '../ui/PatternOverlay'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-accent pb-16 pt-28 sm:pt-32 lg:flex lg:min-h-screen lg:items-center lg:pb-20 lg:pt-24">
      {/* Decorative Pattern Background */}
      <PatternOverlay className="bg-primary opacity-[0.12]" tileWidth={360} />

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:px-8">
        {/* Left Content */}
        <div className="space-y-6 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-secondary sm:text-xs">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            Plátano maduro · Gratinado · A domicilio
          </span>

          <h1 className="text-balance font-display text-[2.6rem] font-bold leading-[1.05] text-dark sm:text-6xl lg:text-[4.25rem]">
            El <span className="text-primary">casao’</span> perfecto{' '}
            <span className="text-secondary">sí existe.</span>
          </h1>

          <p className="mx-auto max-w-md text-base leading-relaxed text-dark/70 sm:text-lg lg:mx-0">
            Plátano maduro asado, bañado en queso gratinado y lleno de recuerdos.
            Comida que sabe a casa de la abuela, a domicilio en todo el Valle de Aburrá y el Oriente.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <ButtonLink
              to="/menu"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              icon={<TextAlignLeftIcon size={20} weight="bold" />}
            >
              Ver el menú
            </ButtonLink>

            <ButtonLink to="/sedes" variant="dark" size="lg" className="w-full sm:w-auto">
              Pedir a domicilio
            </ButtonLink>
          </div>

          <p className="flex items-center justify-center gap-2 text-sm text-dark/70 lg:justify-start">
            <span aria-hidden="true">🍌</span>
            <span>
              <strong className="font-semibold text-secondary">8 sedes</strong> en el Valle de Aburrá y el Oriente
            </span>
          </p>
        </div>

        {/* Right Content - Logo con badges flotantes */}
        <div className="relative mx-auto w-full max-w-[240px] sm:max-w-[320px] lg:max-w-[360px]">
          <div className="aspect-square rounded-full bg-primary-light/40 p-3 shadow-2xl shadow-primary/30 sm:p-4">
            <Logo alt="Logo Demaduro" className="h-full w-full" />
          </div>

          {/* Floating Badges */}
          <Badge
            variant="white"
            icon="🧀"
            className="absolute -left-6 top-[6%] whitespace-nowrap shadow-md sm:-left-10"
          >
            Gratinado de la abuela
          </Badge>

          <Badge
            variant="white"
            icon="🔥"
            className="absolute -right-6 bottom-[24%] whitespace-nowrap shadow-md sm:-right-10"
          >
            Recién hechito
          </Badge>

          <Badge
            variant="white"
            icon="🛵"
            className="absolute bottom-[2%] left-[2%] whitespace-nowrap shadow-md"
          >
            A tu casa
          </Badge>
        </div>
      </div>
    </section>
  )
}
