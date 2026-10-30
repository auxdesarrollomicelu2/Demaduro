import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../helpers/authHelper.js'

// Extender el tipo Request para incluir userData
declare global {
  namespace Express {
    interface Request {
      userData?: {
        userId: number
        email: string
        rol: string
        sedeId?: number
      }
    }
  }
}

/**
 * Middleware para verificar que el usuario está autenticado
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Token no proporcionado',
    })
  }

  const token = authHeader.substring(7) // Remover "Bearer "
  const decoded = verifyToken(token)

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido o expirado',
    })
  }

  // Agregar datos del usuario al request
  req.userData = {
    userId: decoded.userId,
    email: decoded.email,
    rol: decoded.rol,
    sedeId: decoded.sedeId,
  }

  return next()
}

/**
 * Middleware para verificar que el usuario tiene rol de admin
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.userData) {
    return res.status(401).json({
      success: false,
      error: 'Usuario no autenticado',
    })
  }

  if (req.userData.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado. Se requiere rol de administrador.',
    })
  }

  return next()
}

/**
 * Middleware para verificar que el usuario es vendedor de la sede correcta
 */
export function requireSede(req: Request, res: Response, next: NextFunction) {
  if (!req.userData) {
    return res.status(401).json({
      success: false,
      error: 'Usuario no autenticado',
    })
  }

  // Los admin pueden ver todas las sedes
  if (req.userData.rol === 'admin') {
    return next()
  }

  // Los vendedores solo pueden ver su propia sede
  const sedeIdParam = req.params.sedeId || req.body.sede_id

  if (!req.userData.sedeId) {
    return res.status(403).json({
      success: false,
      error: 'Usuario no asignado a ninguna sede',
    })
  }

  if (sedeIdParam && req.userData.sedeId !== Number(sedeIdParam)) {
    return res.status(403).json({
      success: false,
      error: 'No tiene permisos para acceder a esta sede',
    })
  }

  return next()
}
