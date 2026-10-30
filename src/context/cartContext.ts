import { createContext, useContext } from 'react'
import type { CartLine, NewCartLine } from '@/lib/cart'

export interface CartContextValue {
  sedeId: number | null
  contactPhone: string | null
  items: CartLine[]
  count: number
  total: number
  isOpen: boolean
  setSede: (sedeId: number) => void
  setContactPhone: (phone: string) => void
  addItem: (line: NewCartLine) => void
  updateQuantity: (key: string, cantidad: number) => void
  removeItem: (key: string) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}
