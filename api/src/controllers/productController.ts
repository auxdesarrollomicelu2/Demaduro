import type { Request, Response } from 'express'
import * as productService from '../services/productService.js'

/**
 * GET /api/products
 * Get all products
 */
export async function getProducts(_req: Request, res: Response) {
  try {
    const products = await productService.getAllProducts()
    
    return res.json({
      success: true,
      data: products,
      count: products.length,
    })
  } catch (error) {
    console.error('Error getting products:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al obtener productos',
    })
  }
}

/**
 * GET /api/products/:id
 * Get product by ID
 */
export async function getProductById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de producto inválido',
      })
    }

    const product = await productService.getProductById(id)
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      })
    }

    return res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Error getting product:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al obtener producto',
    })
  }
}

/**
 * GET /api/products/category/:category
 * Get products by category
 */
export async function getProductsByCategory(req: Request, res: Response) {
  try {
    const { category } = req.params
    const products = await productService.getProductsByCategory(category)
    
    return res.json({
      success: true,
      data: products,
      count: products.length,
      category,
    })
  } catch (error) {
    console.error('Error getting products by category:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al obtener productos por categoría',
    })
  }
}

/**
 * GET /api/products/categories
 * Get all categories
 */
export async function getCategories(_req: Request, res: Response) {
  try {
    const categories = await productService.getCategories()
    
    return res.json({
      success: true,
      data: categories,
      count: categories.length,
    })
  } catch (error) {
    console.error('Error getting categories:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al obtener categorías',
    })
  }
}

/**
 * POST /api/products
 * Create a new product
 */
export async function createProduct(req: Request, res: Response) {
  try {
    const { nombre, descripcion, precio, categoria, subcategoria, imagen_url, disponible, destacado } = req.body

    // Validaciones
    if (!nombre || precio === undefined || !categoria || disponible === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Campos requeridos: nombre, precio, categoria, disponible',
      })
    }

    if (typeof precio !== 'number' || precio <= 0) {
      return res.status(400).json({
        success: false,
        error: 'El precio debe ser un número mayor a 0',
      })
    }

    if (typeof disponible !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'El campo disponible debe ser boolean',
      })
    }

    if (destacado !== undefined && typeof destacado !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'El campo destacado debe ser boolean',
      })
    }

    const product = await productService.createProduct({
      nombre,
      descripcion,
      precio,
      categoria,
      subcategoria,
      imagen_url,
      disponible,
      destacado,
    })

    return res.status(201).json({
      success: true,
      data: product,
      message: 'Producto creado exitosamente',
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al crear producto',
    })
  }
}

/**
 * PUT /api/products/:id
 * Update product
 */
export async function updateProduct(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de producto inválido',
      })
    }

    const { nombre, descripcion, precio, categoria, subcategoria, imagen_url, disponible, destacado } = req.body

    // Validar precio si se envía
    if (precio !== undefined && (typeof precio !== 'number' || precio <= 0)) {
      return res.status(400).json({
        success: false,
        error: 'El precio debe ser un número mayor a 0',
      })
    }

    if (destacado !== undefined && typeof destacado !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'El campo destacado debe ser boolean',
      })
    }

    const product = await productService.updateProduct(id, {
      nombre,
      descripcion,
      precio,
      categoria,
      subcategoria,
      imagen_url,
      disponible,
      destacado,
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      })
    }

    return res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product,
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al actualizar producto',
    })
  }
}

/**
 * PATCH /api/products/:id/toggle
 * Toggle product availability (disponible)
 */
export async function toggleProductAvailability(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de producto inválido',
      })
    }

    const product = await productService.toggleProductAvailability(id)

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      })
    }

    return res.json({
      success: true,
      message: `Producto ${product.disponible ? 'activado' : 'desactivado'} exitosamente`,
      data: product,
    })
  } catch (error) {
    console.error('Error toggling product availability:', error)
    return res.status(500).json({
      success: false,
      error: 'Error al cambiar disponibilidad del producto',
    })
  }
}
