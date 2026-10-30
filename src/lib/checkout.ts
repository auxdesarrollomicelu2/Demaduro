import type { CartLine } from './cart'

export type TipoEntrega = 'domicilio' | 'recoger'
export type MetodoPago = 'efectivo' | 'transferencia'

export const TIPOS_VIVIENDA = ['Casa', 'Unidad residencial'] as const

const MAX_COMPROBANTE_MB = 5
const COMPROBANTE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

export interface CheckoutForm {
  tipoEntrega: TipoEntrega
  nombre: string
  telefono: string
  email: string
  barrio: string
  tipoVivienda: string
  direccion: string
  indicaciones: string
  metodoPago: MetodoPago | ''
  comprobante: File | null
}

export type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>

export type UpdateCheckoutField = <K extends keyof CheckoutForm>(field: K, value: CheckoutForm[K]) => void

export interface CheckoutSectionProps {
  form: CheckoutForm
  errors: CheckoutErrors
  onChange: UpdateCheckoutField
}

export const fieldId = (field: keyof CheckoutForm) => `checkout-${field}`

export function toLocalMobile(phone: string | null) {
  const digits = (phone ?? '').replace(/\D/g, '')
  const local = digits.length === 12 && digits.startsWith('57') ? digits.slice(2) : digits
  return local.length === 10 ? local : ''
}

export function emptyCheckoutForm(contactPhone: string | null): CheckoutForm {
  return {
    tipoEntrega: 'domicilio',
    nombre: '',
    telefono: toLocalMobile(contactPhone),
    email: '',
    barrio: '',
    tipoVivienda: '',
    direccion: '',
    indicaciones: '',
    metodoPago: '',
    comprobante: null,
  }
}

export function validateCheckout(form: CheckoutForm): CheckoutErrors {
  const errors: CheckoutErrors = {}

  if (form.nombre.trim().length < 3) errors.nombre = 'Escribe tu nombre completo.'
  if (!/^3\d{9}$/.test(form.telefono)) errors.telefono = 'Escribe un celular de 10 dígitos que empiece por 3.'
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Revisa tu correo, parece incompleto.'
  }

  if (form.tipoEntrega === 'domicilio') {
    if (!form.barrio.trim()) errors.barrio = 'Escribe tu barrio.'
    if (!form.tipoVivienda) errors.tipoVivienda = 'Elige el tipo de vivienda.'
    if (form.direccion.trim().length < 5) errors.direccion = 'Escribe tu dirección completa.'
  }

  if (!form.metodoPago) errors.metodoPago = 'Elige cómo vas a pagar.'
  if (form.metodoPago === 'transferencia') {
    if (!form.comprobante) {
      errors.comprobante = 'Adjunta el comprobante de tu transferencia.'
    } else if (!COMPROBANTE_TYPES.includes(form.comprobante.type)) {
      errors.comprobante = 'El comprobante debe ser una imagen (JPG, PNG) o un PDF.'
    } else if (form.comprobante.size > MAX_COMPROBANTE_MB * 1024 * 1024) {
      errors.comprobante = `El comprobante debe pesar menos de ${MAX_COMPROBANTE_MB} MB.`
    }
  }

  return errors
}

export function buildOrderFormData(form: CheckoutForm, sedeId: number, items: CartLine[]) {
  const data = new FormData()
  const isDelivery = form.tipoEntrega === 'domicilio'

  data.append('sede_id', String(sedeId))
  data.append('tipo_entrega', form.tipoEntrega)
  data.append('cliente_nombre', form.nombre.trim())
  data.append('cliente_telefono', `57${form.telefono}`)
  if (form.email.trim()) data.append('cliente_email', form.email.trim())
  if (isDelivery) {
    data.append('barrio', form.barrio.trim())
    data.append('tipo_vivienda', form.tipoVivienda)
    data.append('direccion_entrega', form.direccion.trim())
  }
  if (form.indicaciones.trim()) data.append('notas', form.indicaciones.trim())
  data.append('metodo_pago', form.metodoPago)
  data.append(
    'items',
    JSON.stringify(
      items.map((line) => ({
        product_id: line.product.id,
        cantidad: line.cantidad,
        observaciones: line.observaciones || undefined,
        complementos: line.complements.map((complement) => complement.id),
      }))
    )
  )
  if (form.metodoPago === 'transferencia' && form.comprobante) data.append('comprobante', form.comprobante)

  return data
}
