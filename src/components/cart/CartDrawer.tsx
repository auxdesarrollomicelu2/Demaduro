import { useNavigate } from 'react-router-dom'
import { ShoppingCartIcon, TrashIcon, XIcon } from '@phosphor-icons/react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import QuantityStepper from '../ui/QuantityStepper'
import { useCart } from '@/context/cartContext'
import { unitPrice } from '@/lib/cart'
import { formatCurrency } from '@/lib/utils'

export default function CartDrawer() {
  const { items, count, total, isOpen, closeCart, updateQuantity, removeItem } = useCart()
  const navigate = useNavigate()

  if (!isOpen) return null

  const goToCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <Modal onClose={closeCart} labelledBy="cart-title" position="right">
      <div className="flex h-full flex-col">
        <header className="flex items-center gap-3 bg-dark px-5 py-4 text-white">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-badge text-dark" aria-hidden="true">
            <ShoppingCartIcon size={22} weight="bold" />
          </span>
          <div className="flex-1">
            <h2 id="cart-title" className="font-display text-xl font-bold">
              Mi carrito
            </h2>
            <p className="text-sm text-white/70">
              {count} {count === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <XIcon size={22} weight="bold" aria-hidden="true" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-4xl" aria-hidden="true">🍌</p>
            <p className="font-semibold text-dark">Tu carrito está vacío</p>
            <p className="text-sm text-dark/60">Agrega tus maduritos favoritos para hacer tu pedido.</p>
            <Button variant="secondary" size="sm" onClick={closeCart}>
              Ver el menú
            </Button>
          </div>
        ) : (
          <>
            <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-accent/40 p-4">
              {items.map((line) => (
                <li key={line.key} className="rounded-2xl border border-dark/[0.06] bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold leading-tight text-dark">{line.product.nombre}</p>
                      {line.variante && <p className="mt-0.5 text-xs font-semibold text-secondary">{line.variante}</p>}
                      {line.complements.length > 0 && (
                        <p className="mt-1 text-xs text-dark/60">+ {line.complements.map((c) => c.nombre).join(', ')}</p>
                      )}
                      {line.observaciones && <p className="mt-1 text-xs italic text-dark/50">“{line.observaciones}”</p>}
                    </div>
                    <p className="whitespace-nowrap font-bold text-secondary">{formatCurrency(unitPrice(line) * line.cantidad)}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <QuantityStepper size="sm" value={line.cantidad} onChange={(cantidad) => updateQuantity(line.key, cantidad)} />
                    <button
                      type="button"
                      onClick={() => removeItem(line.key)}
                      aria-label={`Quitar ${line.product.nombre}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    >
                      <TrashIcon size={18} weight="bold" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="space-y-3 border-t border-dark/10 bg-white p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-bold text-dark">Total</p>
                  <p className="text-xs text-dark/60">El domicilio se calcula con tu dirección</p>
                </div>
                <p className="font-display text-2xl font-bold text-dark">{formatCurrency(total)}</p>
              </div>
              <Button variant="primary" size="lg" className="w-full" onClick={goToCheckout}>
                Continuar con mi pedido
              </Button>
              <Button variant="light" className="w-full" onClick={closeCart}>
                Seguir agregando
              </Button>
            </footer>
          </>
        )}
      </div>
    </Modal>
  )
}
