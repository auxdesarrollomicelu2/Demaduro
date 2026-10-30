import { Sede } from '../models/index.js'

export async function getAllSedes() {
  return await Sede.findAll({ order: [['nombre', 'ASC']] })
}

export async function getSedeById(id: number) {
  return await Sede.findByPk(id)
}

export async function createSede(sedeData: {
  nombre: string
  ciudad?: string
  direccion: string
  telefono: string
  whatsapp: string
  email_pedidos: string
  coordenadas?: string
  abreviatura: string
  llave_breb?: string
  qr_pago_url?: string
}) {
  return await Sede.create(sedeData)
}

export async function calculateDeliveryCost(_sedeId: number, _address: string): Promise<number> {
  // TODO: Implementar lógica real
  return 5000
}

export async function updateSede(id: number, sedeData: {
  nombre?: string
  ciudad?: string
  direccion?: string
  telefono?: string
  whatsapp?: string
  email_pedidos?: string
  coordenadas?: string
  abreviatura?: string
  llave_breb?: string
  qr_pago_url?: string
  activo?: boolean
}) {
  const sede = await Sede.findByPk(id)

  if (!sede) {
    return null
  }

  await sede.update(sedeData)
  return sede
}

export async function toggleSedeStatus(id: number) {
  const sede = await Sede.findByPk(id)

  if (!sede) {
    return null
  }

  await sede.update({ activo: !sede.activo })
  return sede
}
