import { Link } from 'react-router-dom'
import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import Button from '../ui/Button'
import { useCart } from '@/context/cartContext'
import { unitPrice } from '@/lib/cart'
import { formatCurrency } from '@/lib/utils'
import type { TipoEntrega } from '@/lib/checkout'

interface OrderSummaryProps {
  formId: string
  tipoEntrega: TipoEntrega
  submitting: boolean
  submitError: boolean
}

export default function OrderSummary({ formId, tipoEntrega, submitting, submitError }: OrderSummaryProps) {
  const { items, total, removeItem } = useCart()

  return (
    <aside className="rounded-3xl border border-dark/[0.06] bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-dark">Tu pedido</h2>
        <Link
          to="/menu"
          className="inline-flex items-center gap-1 rounded-full border border-dark/15 px-3 py-1.5 text-xs font-semibold text-dark transition-colors hover:border-primary hover:text-primary"
        >
          <PlusIcon size={14} weight="bold" aria-hidden="true" />
          Agregar más
        </Link>
      </div>

      <ul className="divide-y divide-dark/[0.06]">
        {items.map((line) => (
          <li key={line.key} className="flex items-start gap-3 py-3">
            <span className="mt-0.5 rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-dark">{line.cantidad}x</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight text-dark">{line.product.nombre}</p>
              {line.variante && <p className="text-xs font-semibold text-secondary">{line.variante}</p>}
              {line.complements.length > 0 && (
                <p className="text-xs text-dark/60">+ {line.complements.map((c) => c.nombre).join(', ')}</p>
              )}
              {line.observaciones && <p className="text-xs italic text-dark/50">“{line.observaciones}”</p>}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="whitespace-nowrap text-sm font-bold text-dark">{formatCurrency(unitPrice(line) * line.cantidad)}</span>
              <button
                type="button"
                onClick={() => removeItem(line.key)}
                aria-label={`Quitar ${line.product.nombre}`}
                className="rounded-full p-1 text-red-500 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <TrashIcon size={16} weight="bold" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-2 space-y-2 border-t border-dark/10 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-dark/70">Subtotal</dt>
          <dd className="font-semibold text-dark">{formatCurrency(total)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-dark/70">Domicilio</dt>
          <dd className="text-right font-semibold text-primary-dark">
            {tipoEntrega === 'domicilio' ? 'Se calcula con tu dirección' : 'Sin costo'}
          </dd>
        </div>
        <div className="flex items-end justify-between border-t border-dark/10 pt-3">
          <dt className="font-display text-lg font-bold text-dark">Total</dt>
          <dd className="font-display text-2xl font-bold text-dark">{formatCurrency(total)}</dd>
        </div>
      </dl>

      {submitError && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          No pudimos registrar tu pedido. Inténtalo de nuevo en un momento.
        </p>
      )}

      <Button type="submit" form={formId} variant="primary" size="lg" className="mt-5 w-full" disabled={submitting}>
        {submitting ? 'Enviando tu pedido…' : '¡Pedir ahora!'}
      </Button>
      <p className="mt-3 text-center text-xs text-dark/50">Al pedir, aceptas nuestros términos de servicio.</p>
    </aside>
  )
}
