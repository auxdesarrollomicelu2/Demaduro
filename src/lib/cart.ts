import type { Product } from './api'

export type CartProduct = Pick<Product, 'id' | 'nombre' | 'precio'>

export interface CartLine {
  key: string
  product: CartProduct
  variante: string | null
  complements: CartProduct[]
  observaciones: string
  cantidad: number
}

export type NewCartLine = Omit<CartLine, 'key'>

export function toCartProduct({ id, nombre, precio }: CartProduct): CartProduct {
  return { id, nombre, precio }
}

export function cartLineKey({ product, complements, observaciones }: NewCartLine) {
  const complementIds = complements.map((c) => c.id).sort((a, b) => a - b).join(',')
  return `${product.id}|${complementIds}|${observaciones.trim().toLowerCase()}`
}

export function unitPrice({ product, complements }: Pick<CartLine, 'product' | 'complements'>) {
  return product.precio + complements.reduce((sum, complement) => sum + complement.precio, 0)
}
