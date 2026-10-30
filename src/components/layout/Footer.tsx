import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import SocialLinks from './SocialLinks'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 mb-10">
          {/* Logo & Description */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <Logo className="h-10 w-10 border-2 border-white/90" />
              <span className="font-display text-2xl font-bold">Demaduro</span>
            </Link>
            <p className="text-white/70 text-sm max-w-xs">
              El sabor del plátano maduro que sabe a casa de la abuela. 🍌
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Enlaces del sitio">
            <h3 className="font-display font-bold text-lg mb-4">Explora</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/menu" className="text-white/70 hover:text-primary transition-colors">
                  Nuestro menú
                </Link>
              </li>
              <li>
                <Link to="/sedes" className="text-white/70 hover:text-primary transition-colors">
                  Sedes
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Síguenos</h3>
            <SocialLinks className="gap-3" linkClassName="bg-white/10 text-white hover:bg-primary" />
            <p className="text-white/70 text-sm mt-4">@demaduro</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-white/50 text-sm">
          <p>© {currentYear} Demaduro • Nuestro love 🍌 y mucho sabor</p>
        </div>
      </div>
    </footer>
  )
}
