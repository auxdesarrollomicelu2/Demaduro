import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

/**
 * Estructura común de las páginas: Navbar fijo + contenido + Footer.
 * El Navbar es fixed (h-16), cada página maneja su propio espacio superior.
 */
export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
