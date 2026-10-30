import type { Request, Response } from 'express'
import * as authService from '../services/authService.js'
import { verifyToken } from '../helpers/authHelper.js'

/**
 * POST /api/auth/login
 * Autentica un usuario y retorna token JWT
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos',
      })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido',
      })
    }

    const result = await authService.login({ email, password })

    if (!result) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
      })
    }

    return res.json({
      success: true,
      message: 'Login exitoso',
      data: result,
    })
  } catch (error: any) {
    console.error('Error in login:', error)

    if (error.message === 'Usuario inactivo') {
      return res.status(403).json({
        success: false,
        error: 'Usuario inactivo. Contacte al administrador.',
      })
    }

    return res.status(500).json({
      success: false,
      error: 'Error al iniciar sesión',
    })
  }
}

/**
 * GET /api/auth/verify
 * Verifica si el token JWT es válido
 */
export async function verify(req: Request, res: Response) {
  try {
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

    // Verificar que el usuario aún existe y está activo
    const user = await authService.getUserById(decoded.userId)

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado o inactivo',
      })
    }

    return res.json({
      success: true,
      message: 'Token válido',
      data: {
        user,
        tokenData: decoded,
      },
    })
  } catch (error) {
    console.error('Error in verify:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al verificar token',
    })
  }
}

/**
 * POST /api/auth/logout
 * Cierra la sesión del usuario (lado cliente debe eliminar el token)
 */
export async function logout(_req: Request, res: Response) {
  try {
    // En JWT stateless, el logout es manejado por el cliente eliminando el token
    // Aquí podemos agregar lógica adicional si necesitamos (ej: blacklist de tokens)

    return res.json({
      success: true,
      message: 'Logout exitoso. Token debe ser eliminado del cliente.',
    })
  } catch (error) {
    console.error('Error in logout:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al cerrar sesión',
    })
  }
}
