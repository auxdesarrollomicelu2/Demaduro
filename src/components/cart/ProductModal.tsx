import { useState } from 'react'
import { XIcon } from '@phosphor-icons/react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import QuantityStepper from '../ui/QuantityStepper'
import { useCart } from '@/context/cartContext'
import { toCartProduct, unitPrice } from '@/lib/cart'
import { capitalize, cn, formatCurrency } from '@/lib/utils'
import type { Product } from '@/lib/api'
import type { MenuOption } from '@/lib/menu'

export interface ProductSelection {
  title: string
  description?: string | null
  imageUrl?: string | null
  options: MenuOption[]
  complementGroups?: { title: string; items: Product[] }[]
}

const sectionLabel = 'text-xs font-bold uppercase tracking-wider text-dark/50'

export default function ProductModal({ selection, onClose }: { selection: ProductSelection; onClose: () => void }) {
  const { title, description, imageUrl, options, complementGroups = [] } = selection
  const { addItem } = useCart()
  const [optionIndex, setOptionIndex] = useState(0)
  const [complementIds, setComplementIds] = useState<number[]>([])
  const [observaciones, setObservaciones] = useState('')
  const [cantidad, setCantidad] = useState(1)

  const option = options[optionIndex]
  const basePrice = options[0].product.precio
  const complements = complementGroups.flatMap((group) => group.items).filter((item) => complementIds.includes(item.id))
  const total = unitPrice({ product: option.product, complements }) * cantidad

  const toggleComplement = (id: number) => {
    setComplementIds((ids) => (ids.includes(id) ? ids.filter((current) => current !== id) : [...ids, id]))
  }

  const handleAdd = () => {
    addItem({
      product: toCartProduct(option.product),
      variante: options.length > 1 ? capitalize(option.label) : null,
      complements: complements.map(toCartProduct),
      observaciones: observaciones.trim(),
      cantidad,
    })
    onClose()
  }

  return (
    <Modal onClose={onClose} labelledBy="product-modal-title">
      <div className="relative flex max-h-[85dvh] flex-col">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-dark shadow-md transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <XIcon size={20} weight="bold" aria-hidden="true" />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {imageUrl && <img src={imageUrl} alt={title} className="h-48 w-full object-cover sm:h-56" />}

          <div className="space-y-5 p-5 sm:p-6">
            <div>
              <h2 id="product-modal-title" className="pr-12 font-display text-2xl font-bold leading-tight text-dark">
                {title}
              </h2>
              {description && <p className="mt-2 text-sm leading-relaxed text-dark/60">{description}</p>}
            </div>

            {options.length > 1 && (
              <fieldset>
                <legend className="flex w-full items-center justify-between gap-3">
                  <span className={sectionLabel}>Elige tu opción</span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-dark">
                    Obligatorio
                  </span>
                </legend>
                <div className="mt-2 space-y-2">
                  {options.map((item, index) => (
                    <label
                      key={item.product.id}
                      className={cn(
                        'flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-colors',
                        index === optionIndex ? 'border-primary bg-primary/5' : 'border-dark/10 hover:border-primary/40'
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="product-option"
                          checked={index === optionIndex}
                          onChange={() => setOptionIndex(index)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span className="font-semibold text-dark">{capitalize(item.label)}</span>
                      </span>
                      <span className="whitespace-nowrap text-sm font-semibold text-dark/50">
                        +{formatCurrency(item.product.precio - basePrice)}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {complementGroups.map((group) => (
              <fieldset key={group.title}>
                <legend className={sectionLabel}>{group.title}</legend>
                <div className="mt-2 space-y-2">
                  {group.items.map((item) => {
                    const checked = complementIds.includes(item.id)
                    return (
                      <label
                        key={item.id}
                        className={cn(
                          'flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-colors',
                          checked ? 'border-primary bg-primary/5' : 'border-dark/10 hover:border-primary/40'
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <input type="checkbox" checked={checked} onChange={() => toggleComplement(item.id)} className="h-4 w-4 accent-primary" />
                          <span className="text-dark">{item.nombre}</span>
                        </span>
                        <span className="whitespace-nowrap text-sm font-semibold text-dark/50">+{formatCurrency(item.precio)}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            ))}

            <div>
              <label htmlFor="product-observaciones" className={sectionLabel}>
                Observaciones
              </label>
              <textarea
                id="product-observaciones"
                rows={2}
                maxLength={200}
                value={observaciones}
                onChange={(event) => setObservaciones(event.target.value)}
                placeholder="Ej. Bien asado, sin maicitos..."
                className="mt-2 w-full resize-none rounded-xl border border-dark/10 bg-accent/40 px-4 py-3 text-sm text-dark placeholder:text-dark/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-dark/10 bg-white p-4 sm:p-5">
          <QuantityStepper value={cantidad} onChange={setCantidad} />
          <Button variant="primary" size="lg" className="flex-1 px-4" onClick={handleAdd}>
            Agregar {formatCurrency(total)}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
