import { PlusIcon, WhatsappLogoIcon } from '@phosphor-icons/react'
import Button, { ButtonLink } from '../ui/Button'
import PatternOverlay from '../ui/PatternOverlay'
import { formatCurrency } from '@/lib/utils'
import { BUILD_GROUPS } from '@/lib/menu'
import type { Product } from '@/lib/api'

interface BuildYourOwnProps {
  products: Product[]
  onBuild?: () => void
}

export default function BuildYourOwn({ products, onBuild }: BuildYourOwnProps) {
  const groups = BUILD_GROUPS.map((group) => ({
    ...group,
    items: products.filter((p) => p.subcategoria === group.subcategoria),
  })).filter((group) => group.items.length > 0)

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-[#F8D47A] p-6 shadow-xl sm:p-8">
        <PatternOverlay className="bg-primary opacity-[0.12]" tileWidth={380} />

        <div className="relative grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <div key={group.subcategoria}>
              <h3 className="mb-3 border-b border-secondary/30 pb-2 text-sm font-bold uppercase tracking-wide text-secondary">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-3 text-sm text-secondary-dark">
                    <span>{item.nombre}</span>
                    <span className="whitespace-nowrap font-bold">{formatCurrency(item.precio)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        {onBuild ? (
          <Button variant="primary" size="md" className="w-full sm:w-auto" onClick={onBuild} icon={<PlusIcon size={18} weight="bold" />}>
            Armar mi madurito
          </Button>
        ) : (
          <ButtonLink
            to="/sedes"
            variant="whatsapp"
            size="md"
            className="w-full sm:w-auto"
            icon={<WhatsappLogoIcon size={18} weight="bold" />}
          >
            Pedir mi domicilio ahora
          </ButtonLink>
        )}
      </div>
    </div>
  )
}
