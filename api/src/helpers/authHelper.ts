import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'demaduro-secret-key-change-in-production'
const JWT_EXPIRES_IN = '8h' // Token válido por 8 horas

interface JwtPayload {
  userId: number
  email: string
  rol: string
  sedeId?: number
}

/**
 * Compara una contraseña en texto plano con el hash almacenado
 */
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword)
  } catch (error) {
    console.error('Error comparing passwords:', error)
    return false
  }
}

/**
 * Genera un token JWT con la información del usuario
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

/**
 * Verifica y decodifica un token JWT
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}

/**
 * Hashea una contraseña usando bcrypt
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10
  return await bcrypt.hash(plainPassword, saltRounds)
}
