import type { Sede } from './api'

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 ? `57${digits}` : digits
}

export function formatPhone(phone: string) {
  const digits = normalizePhone(phone)
  if (digits.length !== 12) return phone
  return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
}

function whatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`
}

export function sedeWhatsAppUrl(sede: Sede) {
  return whatsAppUrl(sede.whatsapp, `¡Hola ${sede.nombre}! 🍌 Quiero hacer un pedido a domicilio`)
}

export function orderConfirmationUrl(sede: Sede, codigo: string) {
  return whatsAppUrl(sede.whatsapp, `¡Hola ${sede.nombre}! 🍌 Ya hice mi pedido ${codigo}`)
}

export function customerOrderConfirmedUrl(order: { cliente_telefono: string; cliente_nombre: string; codigo: string; sede_nombre: string }) {
  return whatsAppUrl(
    order.cliente_telefono,
    `¡Hola ${order.cliente_nombre}! Tu pedido ${order.codigo} en ${order.sede_nombre} fue confirmado. Gracias por pedir en Demaduro.`
  )
}
