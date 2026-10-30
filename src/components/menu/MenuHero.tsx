import { ButtonLink } from '../ui/Button'
import Logo from '../ui/Logo'
import papelPintado from '@/assets/images/Papelpintado.png'

export default function MenuHero() {
  return (
    <section
      className="bg-secondary bg-cover bg-center px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8"
      style={{ backgroundImage: `url(${papelPintado})` }}
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center space-y-4 text-center">
        <Logo alt="Logo Demaduro" className="h-20 w-20 border-4 border-white shadow-lg sm:h-24 sm:w-24" />

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-badge">El sabor de la abuela</p>

        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl md:text-6xl">Nuestro menú</h1>

        <p className="max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
          Maduritos gratinados, dulcecitos de antaño y tu propio madurito a la medida. Elige tu antojo y pídelo a
          domicilio por WhatsApp. <span aria-hidden="true">🍌</span>
        </p>

        <ButtonLink to="/sedes" variant="primary" size="lg" className="w-full sm:w-auto">
          Pedir a domicilio
        </ButtonLink>
      </div>
    </section>
  )
}
