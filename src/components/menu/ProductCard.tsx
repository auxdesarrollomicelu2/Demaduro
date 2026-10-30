import { PlusIcon, StarIcon, WhatsappLogoIcon } from '@phosphor-icons/react'
import Button, { ButtonLink } from '../ui/Button'
import { formatCurrency } from '@/lib/utils'
import type { MenuItem } from '@/lib/menu'

interface ProductCardProps {
  item: MenuItem
  onAdd?: () => void
}

export default function ProductCard({ item, onAdd }: ProductCardProps) {
  const { product, options, destacado } = item
  const variantsNote = options
    .slice(1)
    .map((option) => `${option.label}: ${formatCurrency(option.product.precio)}`)
    .join(', ')

  return (
    <article className="flex h-full flex-col items-center rounded-2xl border border-dark/[0.06] bg-white/60 p-5 text-center shadow-sm transition-shadow hover:shadow-md">
      {/* Imagen + precio */}
      <div className="relative mb-4">
        {destacado && (
          <span className="absolute -top-1 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-yellow-badge px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary shadow-sm">
            <StarIcon size={10} weight="fill" aria-hidden="true" />
            El más pedido
          </span>
        )}

        <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-accent shadow-md sm:h-36 sm:w-36">
          {product.imagen_url && (
            <img src={product.imagen_url} alt={product.nombre} loading="lazy" className="h-full w-full object-cover" />
          )}
        </div>

        <span className="absolute -bottom-1 -right-3 rounded-full border-2 border-white bg-secondary px-3 py-1 text-sm font-bold text-white shadow-md">
          {formatCurrency(product.precio)}
        </span>
      </div>

      {/* Texto */}
      <h3 className="font-display text-lg font-bold leading-tight text-dark">{product.nombre}</h3>

      {(product.descripcion || variantsNote) && (
        <p className="mt-2 text-sm leading-relaxed text-dark/60">
          {product.descripcion}
          {variantsNote && <span className="block font-medium text-dark/70">({variantsNote})</span>}
        </p>
      )}

      <div className="mt-auto w-full pt-4">
        {onAdd ? (
          <Button variant="primary" size="sm" className="w-full" onClick={onAdd} icon={<PlusIcon size={18} weight="bold" />}>
            Agregar al pedido
          </Button>
        ) : (
          <ButtonLink
            to="/sedes"
            variant="whatsapp"
            size="sm"
            className="w-full"
            icon={<WhatsappLogoIcon size={18} weight="bold" />}
          >
            Pedir mi domicilio ahora
          </ButtonLink>
        )}
      </div>
    </article>
  )
}
