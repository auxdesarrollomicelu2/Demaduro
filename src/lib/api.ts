const API_URL = import.meta.env.VITE_API_URL || ''

export interface Sede {
  id: number
  nombre: string
  ciudad?: string | null
  direccion: string
  telefono: string
  whatsapp: string
  email_pedidos: string
  coordenadas?: string
  abreviatura: string
  llave_breb: string | null
  qr_pago_url: string | null
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  nombre: string
  descripcion: string | null
  precio: number
  categoria: string
  subcategoria: string | null
  imagen_url?: string | null
  disponible: boolean
  destacado: boolean
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string // El backend envía aquí el detalle cuando success es false
  count?: number
}

// Sedes
export async function getSedes(): Promise<Sede[]> {
  const response = await fetch(`${API_URL}/api/sedes`)
  const json: ApiResponse<Sede[]> = await response.json()
  
  if (!json.success) {
    throw new Error(json.error || json.message || 'Error al obtener sedes')
  }
  
  return json.data
}

export async function getActiveSedes(): Promise<Sede[]> {
  const sedes = await getSedes()
  return sedes.filter((sede) => sede.activo)
}

export async function getSedeById(id: number): Promise<Sede> {
  const response = await fetch(`${API_URL}/api/sedes/${id}`)
  const json: ApiResponse<Sede> = await response.json()
  
  if (!json.success) {
    throw new Error(json.error || json.message || 'Error al obtener sede')
  }
  
  return json.data
}

// Orders
export async function createOrder(order: FormData): Promise<{ codigo: string }> {
  const response = await fetch(`${API_URL}/api/orders`, { method: 'POST', body: order })
  const json: ApiResponse<{ codigo: string }> = await response.json()

  if (!json.success) {
    throw new Error(json.error || json.message || 'Error al crear el pedido')
  }

  return json.data
}

export interface OrderConfirmation {
  codigo: string
  estado: string
  confirmado_at: string | null
  created_at: string
  sede_nombre: string
  cliente_nombre: string
  cliente_telefono: string
  tipo_entrega: 'domicilio' | 'recoger'
  metodo_pago: 'efectivo' | 'transferencia' | null
  total: number
}

async function orderConfirmationRequest(codigo: string, init?: RequestInit, query = ''): Promise<OrderConfirmation | null> {
  const response = await fetch(`${API_URL}/api/orders/confirmacion/${encodeURIComponent(codigo)}${query}`, init)
  if (response.status === 404) return null

  const json: ApiResponse<OrderConfirmation> = await response.json()
  if (!json.success) {
    throw new Error(json.error || json.message || 'Error al consultar el pedido')
  }

  return json.data
}

export function getOrderConfirmation(codigo: string, token: string) {
  return orderConfirmationRequest(codigo, undefined, `?token=${encodeURIComponent(token)}`)
}

export function confirmOrder(codigo: string, token: string) {
  return orderConfirmationRequest(codigo, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
}

// Products
// PostgreSQL envía los DECIMAL como texto ("39600.00")
function toProduct(product: Product): Product {
  return { ...product, precio: Number(product.precio) }
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/api/products`)
  const json: ApiResponse<Product[]> = await response.json()

  if (!json.success) {
    throw new Error(json.error || json.message || 'Error al obtener productos')
  }

  return json.data.map(toProduct)
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${API_URL}/api/products/categories`)
  const json: ApiResponse<string[]> = await response.json()
  
  if (!json.success) {
    throw new Error(json.error || json.message || 'Error al obtener categorías')
  }
  
  return json.data
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const response = await fetch(`${API_URL}/api/products/category/${category}`)
  const json: ApiResponse<Product[]> = await response.json()

  if (!json.success) {
    throw new Error(json.error || json.message || 'Error al obtener productos')
  }

  return json.data.map(toProduct)
}
