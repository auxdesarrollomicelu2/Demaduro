import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CartContext } from './cartContext'
import { cartLineKey, unitPrice, type CartLine, type NewCartLine } from '@/lib/cart'

const STORAGE_KEY = 'demaduro-cart'

interface StoredCart {
  sedeId: number | null
  contactPhone: string | null
  items: CartLine[]
}

const emptyCart: StoredCart = { sedeId: null, contactPhone: null, items: [] }

function readStoredCart(): StoredCart {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (parsed && Array.isArray(parsed.items)) {
      return {
        sedeId: typeof parsed.sedeId === 'number' ? parsed.sedeId : null,
        contactPhone: typeof parsed.contactPhone === 'string' ? parsed.contactPhone : null,
        items: parsed.items,
      }
    }
    return emptyCart
  } catch {
    return emptyCart
  }
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<StoredCart>(readStoredCart)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch (error) {
      console.warn('No se pudo guardar el carrito:', error)
    }
  }, [cart])

  const setSede = useCallback((sedeId: number) => {
    setCart((current) => (current.sedeId === sedeId ? current : { ...current, sedeId, items: [] }))
  }, [])

  const setContactPhone = useCallback((contactPhone: string) => {
    setCart((current) => (current.contactPhone === contactPhone ? current : { ...current, contactPhone }))
  }, [])

  const addItem = useCallback((line: NewCartLine) => {
    const key = cartLineKey(line)
    setCart((current) => {
      const exists = current.items.some((item) => item.key === key)
      const items = exists
        ? current.items.map((item) => (item.key === key ? { ...item, cantidad: item.cantidad + line.cantidad } : item))
        : [...current.items, { ...line, key }]
      return { ...current, items }
    })
  }, [])

  const updateQuantity = useCallback((key: string, cantidad: number) => {
    setCart((current) => ({
      ...current,
      items: current.items.map((item) => (item.key === key ? { ...item, cantidad } : item)),
    }))
  }, [])

  const removeItem = useCallback((key: string) => {
    setCart((current) => ({ ...current, items: current.items.filter((item) => item.key !== key) }))
  }, [])

  const clear = useCallback(() => {
    setCart((current) => ({ ...current, items: [] }))
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const value = useMemo(
    () => ({
      sedeId: cart.sedeId,
      contactPhone: cart.contactPhone,
      items: cart.items,
      count: cart.items.reduce((sum, item) => sum + item.cantidad, 0),
      total: cart.items.reduce((sum, item) => sum + unitPrice(item) * item.cantidad, 0),
      isOpen,
      setSede,
      setContactPhone,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      openCart,
      closeCart,
    }),
    [cart, isOpen, setSede, setContactPhone, addItem, updateQuantity, removeItem, clear, openCart, closeCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
