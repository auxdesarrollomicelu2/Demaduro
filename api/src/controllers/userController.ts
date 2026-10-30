import type { Request, Response } from 'express'
import * as userService from '../services/userService.js'

export async function getUsers(_req: Request, res: Response) {
  try {
    const users = await userService.getAllUsers()
    return res.json({ success: true, data: users, count: users.length })
  } catch (error) {
    console.error('Error getting users:', error)
    return res.status(500).json({ success: false, error: 'Error al obtener usuarios' })
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'ID inválido' })
    }

    const user = await userService.getUserById(id)
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' })
    }

    return res.json({ success: true, data: user })
  } catch (error) {
    console.error('Error getting user:', error)
    return res.status(500).json({ success: false, error: 'Error al obtener usuario' })
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { nombre, apellido, email, password, rol, sede_id } = req.body

    if (!nombre || !apellido || !email || !password || !rol) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: nombre, apellido, email, password, rol',
      })
    }

    const user = await userService.createUser({ nombre, apellido, email, password, rol, sede_id })
    
    return res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: { ...user.toJSON(), password: undefined },
    })
  } catch (error: any) {
    console.error('Error creating user:', error)
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, error: 'El email ya está registrado' })
    }
    
    return res.status(500).json({ success: false, error: 'Error al crear usuario' })
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'ID inválido' })
    }

    const user = await userService.updateUser(id, req.body)
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' })
    }

    return res.json({ success: true, message: 'Usuario actualizado', data: user })
  } catch (error) {
    console.error('Error updating user:', error)
    return res.status(500).json({ success: false, error: 'Error al actualizar usuario' })
  }
}

export async function toggleUserStatus(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'ID inválido' })
    }

    const user = await userService.toggleUserStatus(id)
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' })
    }

    return res.json({
      success: true,
      message: `Usuario ${user.activo ? 'activado' : 'desactivado'}`,
      data: user,
    })
  } catch (error) {
    console.error('Error toggling user status:', error)
    return res.status(500).json({ success: false, error: 'Error al cambiar estado del usuario' })
  }
}
