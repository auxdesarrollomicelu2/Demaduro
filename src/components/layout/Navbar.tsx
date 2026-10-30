import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ListIcon, XIcon } from '@phosphor-icons/react'
import { ButtonLink } from '../ui/Button'
import Logo from '../ui/Logo'
import SocialLinks from './SocialLinks'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/menu', label: 'Menú' },
  { to: '/sedes', label: 'Sedes' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // Cerrar el menú móvil al cambiar de página
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Cerrar el menú móvil con la tecla Escape
  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-dark/10 bg-accent/90 backdrop-blur-md">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Logo className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-primary/40" />
          <span className="font-display text-xl font-bold text-primary sm:text-2xl">Demaduro</span>
        </Link>

        {/* Navegación - Tablet y Desktop */}
        <div className="hidden items-center gap-5 md:flex lg:gap-8">
          <ul className="flex items-center gap-5 lg:gap-8">
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'text-sm font-medium transition-colors hover:text-primary',
                      isActive ? 'text-primary' : 'text-dark/80'
                    )
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <SocialLinks linkClassName="text-dark/80 hover:text-primary" />

          <ButtonLink to="/sedes" variant="secondary" size="sm">
            Pedir a domicilio
          </ButtonLink>
        </div>

        {/* Botón menú - Celular */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-dark transition-colors hover:bg-dark/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
        >
          {isMenuOpen ? <XIcon size={24} aria-hidden="true" /> : <ListIcon size={24} aria-hidden="true" />}
        </button>
      </nav>

      {/* Menú desplegable - Celular */}
      <div
        id="mobile-menu"
        inert={!isMenuOpen}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-out md:hidden',
          isMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 border-t border-dark/10 px-4 pb-6 pt-2 sm:px-6">
            <ul>
              {navItems.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-dark/5',
                        isActive ? 'text-primary' : 'text-dark'
                      )
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <SocialLinks className="px-1" linkClassName="text-dark/80 hover:bg-dark/5 hover:text-primary" />

            <ButtonLink to="/sedes" variant="secondary" size="md" onClick={closeMenu} className="w-full">
              Pedir a domicilio
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  )
}
