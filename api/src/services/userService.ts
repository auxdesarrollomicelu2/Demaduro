import User from '../models/User.js'
import { Sede } from '../models/index.js'
import bcrypt from 'bcrypt'

// Función helper para obtener fecha en timezone Colombia
function getNowColombia() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }))
}

export async function getAllUsers() {
  return await User.findAll({
    attributes: { exclude: ['password'] },
    include: [{ model: Sede, as: 'sede', required: false }],
    order: [['created_at', 'DESC']],
  })
}

export async function getUserById(id: number) {
  return await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Sede, as: 'sede', required: false }],
  })
}

export async function createUser(userData: {
  nombre: string
  apellido: string
  email: string
  password: string
  rol: 'admin' | 'vendedorTienda'
  sede_id?: number
}) {
  const hashedPassword = await bcrypt.hash(userData.password, 10)
  const now = getNowColombia()
  
  return await User.create({
    ...userData,
    password: hashedPassword,
    activo: true,
    created_at: now,
    updated_at: now,
  })
}

export async function updateUser(id: number, updates: Partial<{
  nombre: string
  apellido: string
  email: string
  rol: 'admin' | 'vendedorTienda'
  sede_id: number
  activo: boolean
}>) {
  const user = await User.findByPk(id)
  if (!user) return null
  
  await user.update({
    ...updates,
    updated_at: getNowColombia(),
  })
  return user
}

export async function updatePassword(id: number, newPassword: string) {
  const user = await User.findByPk(id)
  if (!user) return null
  
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  user.password = hashedPassword
  await user.save()
  return user
}

export async function toggleUserStatus(id: number) {
  const user = await User.findByPk(id)
  if (!user) return null
  
  user.activo = !user.activo
  await user.save()
  return user
}

export async function verifyPassword(email: string, password: string) {
  const user = await User.findOne({ where: { email } })
  if (!user) return null
  
  const isValid = await bcrypt.compare(password, user.password)
  return isValid ? user : null
}
