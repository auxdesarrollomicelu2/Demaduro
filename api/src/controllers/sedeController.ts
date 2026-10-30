import type { Request, Response } from 'express'
import * as sedeService from '../services/sedeService.js'

function parseSedeId(value: string): number | null {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

/**
 * GET /api/sedes
 * Get all sedes
 */
export async function getSedes(_req: Request, res: Response) {
  try {
    const sedes = await sedeService.getAllSedes()
    
    return res.json({
      success: true,
      data: sedes,
      count: sedes.length,
    })
  } catch (error) {
    console.error('Error getting sedes:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al obtener sedes',
    })
  }
}

/**
 * GET /api/sedes/:id
 * Get sede by ID
 */
export async function getSedeById(req: Request, res: Response) {
  try {
    const id = parseSedeId(req.params.id)
    if (!id) {
      return res.status(400).json({ success: false, error: 'ID de sede inválido' })
    }

    const sede = await sedeService.getSedeById(id)

    if (!sede) {
      return res.status(404).json({
        success: false,
        error: 'Sede no encontrada',
      })
    }

    return res.json({
      success: true,
      data: sede,
    })
  } catch (error) {
    console.error('Error getting sede:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al obtener sede',
    })
  }
}

/**
 * POST /api/sedes
 * Create a new sede
 */
export async function createSede(req: Request, res: Response) {
  try {
    const { nombre, ciudad, direccion, telefono, whatsapp, email_pedidos, coordenadas, abreviatura, llave_breb, qr_pago_url } = req.body

    // Validar campos requeridos
    if (!nombre || !direccion || !telefono || !whatsapp || !email_pedidos || !abreviatura) {
      return res.status(400).json({
        success: false,
        error: 'Campos requeridos: nombre, direccion, telefono, whatsapp, email_pedidos, abreviatura',
      })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email_pedidos)) {
      return res.status(400).json({
        success: false,
        error: 'El email_pedidos debe ser un email válido',
      })
    }

    const sede = await sedeService.createSede({
      nombre,
      ciudad,
      direccion,
      telefono,
      whatsapp,
      email_pedidos,
      coordenadas,
      abreviatura,
      llave_breb,
      qr_pago_url,
    })

    return res.status(201).json({
      success: true,
      message: 'Sede creada exitosamente',
      data: sede,
    })
  } catch (error: any) {
    console.error('Error creating sede:', error)

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        error: 'La abreviatura ya está en uso por otra sede',
      })
    }

    return res.status(500).json({ 
      success: false, 
      error: 'Error al crear sede' 
    })
  }
}

/**
 * POST /api/sedes/delivery-cost
 * Calculate delivery cost
 */
export async function calculateDeliveryCost(req: Request, res: Response) {
  try {
    const { address } = req.body
    const sede_id = parseSedeId(String(req.body.sede_id))

    if (!sede_id || !address) {
      return res.status(400).json({
        success: false,
        error: 'Sede (id numérico) y dirección son requeridos',
      })
    }

    const cost = await sedeService.calculateDeliveryCost(sede_id, address)
    
    return res.json({
      success: true,
      data: {
        sede_id,
        address,
        delivery_cost: cost,
      },
    })
  } catch (error) {
    console.error('Error calculating delivery cost:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al calcular costo de domicilio',
    })
  }
}

/**
 * PUT /api/sedes/:id
 * Update sede
 */
export async function updateSede(req: Request, res: Response) {
  try {
    const id = parseSedeId(req.params.id)
    if (!id) {
      return res.status(400).json({ success: false, error: 'ID de sede inválido' })
    }

    const { nombre, ciudad, direccion, telefono, whatsapp, email_pedidos, coordenadas, abreviatura, llave_breb, qr_pago_url, activo } = req.body

    // Validar email si se envía
    if (email_pedidos) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email_pedidos)) {
        return res.status(400).json({
          success: false,
          error: 'El email_pedidos debe ser un email válido',
        })
      }
    }

    const sede = await sedeService.updateSede(id, {
      nombre,
      ciudad,
      direccion,
      telefono,
      whatsapp,
      email_pedidos,
      coordenadas,
      abreviatura,
      llave_breb,
      qr_pago_url,
      activo,
    })

    if (!sede) {
      return res.status(404).json({
        success: false,
        error: 'Sede no encontrada',
      })
    }

    return res.json({
      success: true,
      message: 'Sede actualizada exitosamente',
      data: sede,
    })
  } catch (error) {
    console.error('Error updating sede:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al actualizar sede',
    })
  }
}

/**
 * PATCH /api/sedes/:id/toggle
 * Toggle sede status (activo)
 */
export async function toggleSedeStatus(req: Request, res: Response) {
  try {
    const id = parseSedeId(req.params.id)
    if (!id) {
      return res.status(400).json({ success: false, error: 'ID de sede inválido' })
    }

    const sede = await sedeService.toggleSedeStatus(id)

    if (!sede) {
      return res.status(404).json({
        success: false,
        error: 'Sede no encontrada',
      })
    }

    return res.json({
      success: true,
      message: `Sede ${sede.activo ? 'activada' : 'desactivada'} exitosamente`,
      data: sede,
    })
  } catch (error) {
    console.error('Error toggling sede status:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al cambiar estado de la sede',
    })
  }
}
