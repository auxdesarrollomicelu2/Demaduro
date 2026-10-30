import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import { ButtonLink } from '../ui/Button'
import PatternOverlay from '../ui/PatternOverlay'
import papelPintado from '@/assets/images/Papelpintado.png'

export default function MenuSection() {
  return (
    <section className="relative overflow-hidden py-12 px-4 sm:py-16 sm:px-6 lg:px-8 bg-accent">
      <PatternOverlay className="bg-white opacity-80" tileWidth={400} />

      <div className="relative max-w-5xl mx-auto">
        <div
          className="bg-secondary bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl"
          style={{ backgroundImage: `url(${papelPintado})` }}
        >
          <div className="grid md:grid-cols-2 gap-10 md:gap-8 p-6 sm:p-8 md:p-12">
            {/* Left Content */}
            <div className="space-y-6 flex flex-col justify-center items-center text-center md:items-start md:text-left">
              <Badge variant="yellow" icon="🍽️">
                Antojo asegurado
              </Badge>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white">
                Mira nuestro menú
              </h2>

              <p className="text-white/90 text-base sm:text-lg">
                Maduritos gratinados, pizzas de plátano, Tex-Mex y el inolvidable Súper Gratinado de la Abuela.
                Échale el ojo y se te abre el apetito.
              </p>

              <ButtonLink to="/menu" variant="primary" size="lg" className="w-full sm:w-auto">
                Abrir menú completo
              </ButtonLink>
            </div>

            {/* Right Content - Menu Preview Image */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-sm transform rotate-2 sm:rotate-3 hover:rotate-0 transition-transform duration-300">
                {/* Mock menu cards */}
                <div className="bg-accent-light rounded-2xl p-4 sm:p-6 shadow-xl space-y-4 w-full">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-secondary/20">
                    <span className="font-bold text-lg text-secondary">DEMADURO</span>
                    <span className="text-2xl">🍌</span>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Menu items preview */}
                    <div className="flex justify-between items-center bg-white rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg"></div>
                        <div>
                          <p className="font-semibold text-sm text-dark">Gratinado Clásico</p>
                          <p className="text-xs text-dark-light">Con queso</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary">$18.000</span>
                    </div>

                    <div className="flex justify-between items-center bg-white rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-secondary/20 rounded-lg"></div>
                        <div>
                          <p className="font-semibold text-sm text-dark">Pizza Demaduro</p>
                          <p className="text-xs text-dark-light">Pepperoni</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary">$25.000</span>
                    </div>

                    <div className="flex justify-between items-center bg-white rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-yellow-badge/20 rounded-lg"></div>
                        <div>
                          <p className="font-semibold text-sm text-dark">Tex-Mex</p>
                          <p className="text-xs text-dark-light">Especial</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary">$22.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action below */}
        <div className="text-center mt-8">
          <p className="text-dark-light text-lg">
            ¿Ya se te antojó? Ahora{' '}
            <Link to="/sedes" className="text-primary font-bold hover:underline">
              elige tu sede más cercana
            </Link>{' '}
            y pídelo 🍌
          </p>
        </div>
      </div>
    </section>
  )
}
