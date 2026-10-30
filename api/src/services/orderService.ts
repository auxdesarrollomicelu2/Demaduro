import crypto from 'node:crypto'
import { QueryTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { Order, OrderItem, Sede, Product } from '../models/index.js'
import { sendOrderEmail } from '../config/email.js'
import { generatePaymentProofFilename, isR2Configured, uploadToR2 } from '../config/cloudflare.js'
import type { CreateOrderInput, PaymentProof } from '../types/index.js'

export class OrderError extends Error {}

const sedesTable = `"${Sede.options.schema}"."${Sede.tableName}"`

export async function createOrder(input: CreateOrderInput, comprobante?: PaymentProof) {
  const sede = await Sede.findByPk(input.sede_id)
  if (!sede || !sede.activo) throw new OrderError('La sede no está recibiendo pedidos')

  const productIds = [...new Set(input.items.flatMap((item) => [item.product_id, ...item.complementos]))]
  const products = await Product.findAll({ where: { id: productIds, disponible: true } })
  const productById = new Map(products.map((product) => [product.id, product]))
  if (productById.size !== productIds.length) throw new OrderError('Uno de los productos ya no está disponible')

  const priceOf = (id: number) => Number(productById.get(id)!.precio)

  const rows = input.items.flatMap((item) => [
    {
      product_id: item.product_id,
      cantidad: item.cantidad,
      precio_unitario: priceOf(item.product_id),
      subtotal: priceOf(item.product_id) * item.cantidad,
      observaciones: item.observaciones,
    },
    ...item.complementos.map((id) => ({
      product_id: id,
      cantidad: item.cantidad,
      precio_unitario: priceOf(id),
      subtotal: priceOf(id) * item.cantidad,
    })),
  ])

  const subtotal = rows.reduce((sum, row) => sum + row.subtotal, 0)
  const costoDomicilio = 0
  const tokenConfirmacion = crypto.randomBytes(32).toString('hex')

  if (comprobante && !isR2Configured()) {
    console.warn('⚠️ Comprobante no guardado en R2 (no configurado); se envía adjunto en el correo')
  }

  const order = await sequelize.transaction(async (transaction) => {
    const [consecutivo] = await sequelize.query<{ abreviatura: string; consecutivo_pedido: number }>(
      `UPDATE ${sedesTable} SET consecutivo_pedido = consecutivo_pedido + 1 WHERE id = :id RETURNING abreviatura, consecutivo_pedido`,
      { replacements: { id: sede.id }, type: QueryTypes.SELECT, transaction }
    )
    const codigo = `${consecutivo.abreviatura}-${String(consecutivo.consecutivo_pedido).padStart(4, '0')}`

    const soportePago =
      comprobante && isR2Configured()
        ? await uploadToR2(comprobante.buffer, generatePaymentProofFilename(codigo, comprobante.originalName), comprobante.mimeType)
        : undefined

    const created = await Order.create(
      {
        codigo,
        sede_id: sede.id,
        tipo_entrega: input.tipo_entrega,
        cliente_nombre: input.cliente_nombre,
        cliente_telefono: input.cliente_telefono,
        cliente_email: input.cliente_email,
        barrio: input.barrio,
        tipo_vivienda: input.tipo_vivienda,
        direccion_entrega: input.direccion_entrega,
        subtotal,
        costo_domicilio: costoDomicilio,
        total: subtotal + costoDomicilio,
        soporte_pago: soportePago,
        metodo_pago: input.metodo_pago,
        estado: 'pendiente',
        notas: input.notas,
        token_confirmacion: tokenConfirmacion,
      },
      { transaction }
    )

    await OrderItem.bulkCreate(
      rows.map((row) => ({ ...row, order_id: created.id })),
      { transaction }
    )

    return created
  })

  const productName = (id: number) => {
    const product = productById.get(id)!
    return product.subcategoria ? `${product.nombre} (${product.subcategoria})` : product.nombre
  }

  void sendOrderEmail(
    {
      codigo: order.codigo,
      tokenConfirmacion,
      sedeNombre: sede.nombre,
      fecha: order.created_at ?? new Date(),
      tipoEntrega: input.tipo_entrega,
      clienteNombre: input.cliente_nombre,
      clienteTelefono: input.cliente_telefono,
      clienteEmail: input.cliente_email,
      barrio: input.barrio,
      tipoVivienda: input.tipo_vivienda,
      direccion: input.direccion_entrega,
      notas: input.notas,
      lines: input.items.map((item) => ({
        cantidad: item.cantidad,
        nombre: productName(item.product_id),
        complementos: item.complementos.map((id) => productById.get(id)!.nombre),
        observaciones: item.observaciones,
      })),
      subtotal,
      costoDomicilio: input.tipo_entrega === 'domicilio' ? null : 0,
      total: subtotal + costoDomicilio,
      metodoPago: input.metodo_pago,
      comprobante: comprobante && { name: comprobante.originalName, contentType: comprobante.mimeType, buffer: comprobante.buffer },
    },
    sede.email_pedidos
  )

  return { codigo: order.codigo }
}

function tokensMatch(expected: string, received: string) {
  const a = Buffer.from(expected)
  const b = Buffer.from(received)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

async function findOrderForConfirmation(codigo: string, token: string) {
  const order = await Order.findOne({ where: { codigo }, include: [{ model: Sede, as: 'sede' }] })
  return order && tokensMatch(order.token_confirmacion, token) ? order : null
}

function toConfirmationView(order: Order) {
  return {
    codigo: order.codigo,
    estado: order.estado,
    confirmado_at: order.confirmado_at ?? null,
    created_at: order.created_at,
    sede_nombre: (order.get('sede') as Sede | undefined)?.nombre ?? '',
    cliente_nombre: order.cliente_nombre,
    cliente_telefono: order.cliente_telefono,
    tipo_entrega: order.tipo_entrega,
    metodo_pago: order.metodo_pago ?? null,
    total: Number(order.total),
  }
}

export async function getOrderConfirmation(codigo: string, token: string) {
  const order = await findOrderForConfirmation(codigo, token)
  return order ? toConfirmationView(order) : null
}

export async function confirmOrder(codigo: string, token: string) {
  const order = await findOrderForConfirmation(codigo, token)
  if (!order) return null

  if (order.estado === 'pendiente') {
    await order.update({ estado: 'confirmado', confirmado_at: new Date() })
  }

  return toConfirmationView(order)
}

export async function getOrderById(orderId: string) {
  return await Order.findByPk(orderId, {
    include: [
      { model: Sede, as: 'sede' },
      { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
    ],
  })
}

export async function getOrders(filters: any = {}) {
  const where: any = {}
  if (filters.sede_id) where.sede_id = filters.sede_id
  if (filters.estado) where.estado = filters.estado

  return await Order.findAll({
    where,
    include: [{ model: Sede, as: 'sede' }],
    order: [['created_at', 'DESC']],
    limit: filters.limit,
  })
}

export async function updateOrderStatus(orderId: string, status: string) {
  const order = await Order.findByPk(orderId)
  if (!order) return null

  order.estado = status
  await order.save()
  return order
}

export async function getOrdersBySede(sedeId: number, filters: any = {}) {
  const where: any = { sede_id: sedeId }

  if (filters.estado) {
    where.estado = filters.estado
  }

  return await Order.findAll({
    where,
    include: [
      { model: Sede, as: 'sede' },
      { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
    ],
    order: [['created_at', 'DESC']],
    limit: filters.limit || 50,
  })
}
