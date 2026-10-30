import { Product } from '../models/index.js'
import sequelize from '../config/database.js'

export async function getAllProducts() {
  return await Product.findAll({
    where: { disponible: true },
    order: [['categoria', 'ASC'], ['nombre', 'ASC'], ['precio', 'ASC']],
  })
}

export async function getProductById(id: number) {
  return await Product.findByPk(id)
}

export async function getProductsByCategory(category: string) {
  return await Product.findAll({
    where: { categoria: category, disponible: true },
    order: [['nombre', 'ASC'], ['precio', 'ASC']],
  })
}

export async function getCategories() {
  const results = await Product.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('categoria')), 'categoria']],
    where: { disponible: true },
    order: [['categoria', 'ASC']],
    raw: true,
  })
  return results.map((r: any) => r.categoria)
}

export async function createProduct(productData: {
  nombre: string
  descripcion?: string
  precio: number
  categoria: string
  subcategoria?: string
  imagen_url?: string
  disponible: boolean
  destacado?: boolean
}) {
  return await Product.create(productData)
}

export async function updateProduct(id: number, productData: {
  nombre?: string
  descripcion?: string
  precio?: number
  categoria?: string
  subcategoria?: string
  imagen_url?: string
  disponible?: boolean
  destacado?: boolean
}) {
  const product = await Product.findByPk(id)
  
  if (!product) {
    return null
  }

  await product.update(productData)
  return product
}

export async function toggleProductAvailability(id: number) {
  const product = await Product.findByPk(id)
  
  if (!product) {
    return null
  }

  await product.update({ disponible: !product.disponible })
  return product
}
