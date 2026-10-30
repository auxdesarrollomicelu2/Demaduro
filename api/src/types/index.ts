/**
 * Type definitions for Demaduro API
 */

export interface Sede {
  id: number
  nombre: string
  ciudad?: string
  direccion: string
  telefono: string
  whatsapp: string
  email_pedidos: string
  coordenadas?: string // formato "lat,lng"
  activo: boolean
  created_at: Date
  updated_at: Date
}

export interface Product {
  id: number
  nombre: string
  precio: number
  categoria: string
  subcategoria?: string
  descripcion?: string
  imagen_url?: string
  disponible: boolean
  destacado: boolean
  created_at: Date
  updated_at: Date
}

export interface Order {
  id: number
  codigo: string
  sede_id: number
  tipo_entrega: 'domicilio' | 'recoger'
  cliente_nombre: string
  cliente_telefono: string
  cliente_email?: string
  barrio?: string
  tipo_vivienda?: string
  direccion_entrega?: string
  subtotal: number
  costo_domicilio: number
  total: number
  soporte_pago?: string
  metodo_pago?: 'efectivo' | 'transferencia'
  estado: 'pendiente' | 'confirmado' | 'preparando' | 'entregado' | 'cancelado'
  notas?: string
  created_at: Date
  updated_at: Date
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
  observaciones?: string
  created_at: Date
}

export interface CreateOrderItemInput {
  product_id: number
  cantidad: number
  observaciones?: string
  complementos: number[]
}

export interface CreateOrderInput {
  sede_id: number
  tipo_entrega: 'domicilio' | 'recoger'
  cliente_nombre: string
  cliente_telefono: string
  cliente_email?: string
  barrio?: string
  tipo_vivienda?: string
  direccion_entrega?: string
  notas?: string
  metodo_pago: 'efectivo' | 'transferencia'
  items: CreateOrderItemInput[]
}

export interface PaymentProof {
  buffer: Buffer
  originalName: string
  mimeType: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
