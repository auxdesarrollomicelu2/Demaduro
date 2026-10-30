import { User } from '../models/index.js'
import { comparePassword, generateToken } from '../helpers/authHelper.js'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    nombre: string
    apellido: string
    email: string
    rol: string
    sedeId?: number
  }
}

/**
 * Autentica un usuario y retorna un token JWT
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse | null> {
  const { email, password } = credentials

  // Buscar usuario por email
  const user = await User.findOne({ where: { email } })

  if (!user) {
    return null
  }

  // Verificar que el usuario esté activo
  if (!user.activo) {
    throw new Error('Usuario inactivo')
  }

  // Comparar contraseña
  const isPasswordValid = await comparePassword(password, user.password)

  if (!isPasswordValid) {
    return null
  }

  // Generar token JWT
  const token = generateToken({
    userId: user.id,
    email: user.email,
    rol: user.rol,
    sedeId: user.sede_id || undefined,
  })

  return {
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
      sedeId: user.sede_id || undefined,
    },
  }
}

/**
 * Verifica si un usuario existe y está activo
 */
export async function getUserById(userId: number) {
  const user = await User.findByPk(userId)

  if (!user || !user.activo) {
    return null
  }

  return {
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    rol: user.rol,
    sedeId: user.sede_id || undefined,
  }
}
