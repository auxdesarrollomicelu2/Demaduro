import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface MenuTab {
  id: string
  title: string
  icon: string
}

/**
 * Pestañas fijas debajo del Navbar: llevan a cada sección y resaltan la que está en pantalla
 */
export default function MenuTabs({ tabs }: { tabs: MenuTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )

    tabs.forEach(({ id }) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [tabs])

  return (
    <nav
      aria-label="Secciones del menú"
      className="sticky top-16 z-40 border-b border-dark/10 bg-[#FCFAF7]/95 backdrop-blur-md"
    >
      <ul className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-2.5 sm:justify-center sm:px-6">
        {tabs.map(({ id, title, icon }) => (
          <li key={id} className="shrink-0">
            <a
              href={`#${id}`}
              aria-current={activeId === id ? 'true' : undefined}
              className={cn(
                'flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                activeId === id ? 'bg-primary text-white shadow-md' : 'text-dark/80 hover:bg-dark/5'
              )}
            >
              <span aria-hidden="true">{icon}</span>
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
