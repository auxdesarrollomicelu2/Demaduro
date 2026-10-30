import { useCart } from '@/context/cartContext'
import { formatCurrency } from '@/lib/utils'

export default function CartButton() {
  const { count, total, openCart } = useCart()

  if (count === 0) return null

  return (
    <button
      type="button"
      onClick={openCart}
      className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between gap-3 rounded-full bg-primary py-3 pl-3 pr-5 font-semibold text-white shadow-xl transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-primary">{count}</span>
      <span>Ver mi carrito</span>
      <span className="font-bold">{formatCurrency(total)}</span>
    </button>
  )
}
