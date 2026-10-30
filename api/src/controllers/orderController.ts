import type { Request, Response } from 'express'
import * as orderService from '../services/orderService.js'
import type { CreateOrderInput, CreateOrderItemInput } from '../types/index.js'

const optionalText = (value: unknown, maxLength: number) =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, maxLength) : undefined

/**
 * Valida y normaliza el pedido recibido como multipart/form-data. Retorna el mensaje de error si es inválido.
 */
function parseOrderInput(body: Record<string, unknown>): CreateOrderInput | string {
  const sedeId = Number(body.sede_id)
  const tipoEntrega = body.tipo_entrega
  const metodoPago = body.metodo_pago
  const nombre = optionalText(body.cliente_nombre, 200)
  const telefono = typeof body.cliente_telefono === 'string' ? body.cliente_telefono.replace(/\D/g, '') : ''
  const barrio = optionalText(body.barrio, 100)
  const tipoVivienda = optionalText(body.tipo_vivienda, 30)
  const direccion = optionalText(body.direccion_entrega, 500)

  if (!Number.isInteger(sedeId) || sedeId <= 0) return 'Sede inválida'
  if (tipoEntrega !== 'domicilio' && tipoEntrega !== 'recoger') return 'Tipo de entrega inválido'
  if (metodoPago !== 'efectivo' && metodoPago !== 'transferencia') return 'Método de pago inválido'
  if (!nombre) return 'El nombre es requerido'
  if (!/^573\d{9}$/.test(telefono)) return 'Teléfono inválido'
  if (tipoEntrega === 'domicilio' && (!barrio || !tipoVivienda || !direccion)) {
    return 'Barrio, tipo de vivienda y dirección son requeridos para domicilio'
  }

  let rawItems: unknown
  try {
    rawItems = JSON.parse(String(body.items))
  } catch {
    return 'Productos inválidos'
  }
  if (!Array.isArray(rawItems) || rawItems.length === 0) return 'Debe agregar al menos un producto al pedido'

  const items: CreateOrderItemInput[] = []
  for (const raw of rawItems as Record<string, unknown>[]) {
    const productId = Number(raw?.product_id)
    const cantidad = Number(raw?.cantidad)
    const complementos = Array.isArray(raw?.complementos) ? raw.complementos.map(Number) : []

    const valid =
      Number.isInteger(productId) &&
      productId > 0 &&
      Number.isInteger(cantidad) &&
      cantidad >= 1 &&
      cantidad <= 99 &&
      complementos.every((id) => Number.isInteger(id) && id > 0)
    if (!valid) return 'Productos inválidos'

    items.push({ product_id: productId, cantidad, observaciones: optionalText(raw.observaciones, 200), complementos })
  }

  return {
    sede_id: sedeId,
    tipo_entrega: tipoEntrega,
    cliente_nombre: nombre,
    cliente_telefono: telefono,
    cliente_email: optionalText(body.cliente_email, 100),
    barrio: tipoEntrega === 'domicilio' ? barrio : undefined,
    tipo_vivienda: tipoEntrega === 'domicilio' ? tipoVivienda : undefined,
    direccion_entrega: tipoEntrega === 'domicilio' ? direccion : undefined,
    notas: optionalText(body.notas, 500),
    metodo_pago: metodoPago,
    items,
  }
}

/**
 * POST /api/orders
 * Create a new order
 */
export async function createOrder(req: Request, res: Response) {
  try {
    const input = parseOrderInput(req.body)
    if (typeof input === 'string') {
      return res.status(400).json({ success: false, error: input })
    }

    if (input.metodo_pago === 'transferencia' && !req.file) {
      return res.status(400).json({ success: false, error: 'Adjunta el comprobante de la transferencia' })
    }

    const comprobante = req.file && {
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
    }

    const result = await orderService.createOrder(input, comprobante)

    return res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: result,
    })
  } catch (error) {
    if (error instanceof orderService.OrderError) {
      return res.status(409).json({ success: false, error: error.message })
    }

    console.error('Error creating order:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al crear el pedido',
    })
  }
}

const INVALID_CONFIRMATION_LINK = 'El enlace de confirmación no es válido'

/**
 * GET /api/orders/confirmacion/:codigo?token=
 * Resumen del pedido para el botón "Confirmar pedido" del correo
 */
export async function getOrderConfirmation(req: Request, res: Response) {
  try {
    const token = typeof req.query.token === 'string' ? req.query.token : ''
    const order = token ? await orderService.getOrderConfirmation(req.params.codigo, token) : null

    if (!order) {
      return res.status(404).json({ success: false, error: INVALID_CONFIRMATION_LINK })
    }

    return res.json({ success: true, data: order })
  } catch (error) {
    console.error('Error getting order confirmation:', error)
    return res.status(500).json({ success: false, error: 'Error al obtener el pedido' })
  }
}

/**
 * POST /api/orders/confirmacion/:codigo
 * La sede confirma que recibió el pedido
 */
export async function confirmOrder(req: Request, res: Response) {
  try {
    const token = typeof req.body?.token === 'string' ? req.body.token : ''
    const order = token ? await orderService.confirmOrder(req.params.codigo, token) : null

    if (!order) {
      return res.status(404).json({ success: false, error: INVALID_CONFIRMATION_LINK })
    }

    return res.json({ success: true, message: 'Pedido confirmado', data: order })
  } catch (error) {
    console.error('Error confirming order:', error)
    return res.status(500).json({ success: false, error: 'Error al confirmar el pedido' })
  }
}

/**
 * GET /api/orders/:id
 * Get order by ID
 */
export async function getOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const order = await orderService.getOrderById(id)

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado',
      })
    }

    return res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error('Error getting order:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al obtener el pedido',
    })
  }
}

/**
 * GET /api/orders
 * Get all orders with filters
 */
export async function getOrders(req: Request, res: Response) {
  try {
    const filters = {
      sede_id: req.query.sede_id ? Number(req.query.sede_id) : undefined,
      estado: req.query.estado as string,
      fecha: req.query.fecha as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    }

    const orders = await orderService.getOrders(filters)

    return res.json({
      success: true,
      data: orders,
      count: orders.length,
      filters,
    })
  } catch (error) {
    console.error('Error getting orders:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al obtener pedidos',
    })
  }
}

/**
 * PATCH /api/orders/:id/status
 * Update order status
 */
export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { estado } = req.body

    if (!estado) {
      return res.status(400).json({
        success: false,
        error: 'Estado es requerido',
      })
    }

    const validStatuses = ['pendiente', 'confirmado', 'preparando', 'entregado', 'cancelado']
    if (!validStatuses.includes(estado)) {
      return res.status(400).json({
        success: false,
        error: `Estado inválido. Debe ser: ${validStatuses.join(', ')}`,
      })
    }

    const order = await orderService.updateOrderStatus(id, estado)

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado',
      })
    }

    return res.json({
      success: true,
      message: 'Estado actualizado exitosamente',
      data: order,
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al actualizar estado del pedido',
    })
  }
}

/**
 * GET /api/orders/sede/:sedeId
 * Get orders by sede
 */
export async function getOrdersBySede(req: Request, res: Response) {
  try {
    const sedeId = Number(req.params.sedeId)
    const { estado, limit } = req.query

    if (!Number.isInteger(sedeId) || sedeId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'ID de sede inválido',
      })
    }

    // Si es vendedor, verificar que sea de su sede
    if (req.userData && req.userData.rol === 'vendedorTienda') {
      if (req.userData.sedeId !== sedeId) {
        return res.status(403).json({
          success: false,
          error: 'No tiene permisos para ver pedidos de esta sede',
        })
      }
    }

    const orders = await orderService.getOrdersBySede(sedeId, {
      estado: estado as string,
      limit: limit ? parseInt(limit as string) : undefined,
    })

    return res.json({
      success: true,
      data: orders,
      count: orders.length,
      sede_id: sedeId,
    })
  } catch (error) {
    console.error('Error getting orders by sede:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al obtener pedidos de la sede',
    })
  }
}
