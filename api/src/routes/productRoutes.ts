import { Router } from 'express'
import * as productController from '../controllers/productController.js'
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Obtener todos los productos disponibles
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/', productController.getProducts)

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Crear un nuevo producto (requiere autenticación admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *               - categoria
 *               - disponible
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Gratinado de Pollo
 *                 description: Nombre del producto
 *               descripcion:
 *                 type: string
 *                 example: Platano maduro asado con pollo desmechado, maicitos, gratinado con queso mozzarella y parmesano.
 *                 description: Descripción detallada del producto (opcional)
 *               precio:
 *                 type: number
 *                 example: 26400
 *                 description: Precio en pesos colombianos
 *               categoria:
 *                 type: string
 *                 example: Salados
 *                 description: Categoría del producto
 *               subcategoria:
 *                 type: string
 *                 example: Sin tocineta
 *                 description: Variante del producto o grupo de complemento (Base, Queso, Salsa, Topping, Adicion) (opcional)
 *               destacado:
 *                 type: boolean
 *                 example: false
 *                 description: Si el producto se destaca en el Home (opcional)
 *               imagen_url:
 *                 type: string
 *                 example: https://example.com/hamburguesa.jpg
 *                 description: URL de la imagen del producto (opcional)
 *               disponible:
 *                 type: boolean
 *                 example: true
 *                 description: Si el producto está disponible para la venta
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/', authenticateToken, requireAdmin, productController.createProduct)

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     tags: [Products]
 *     summary: Obtener todas las categorías
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/categories', productController.getCategories)

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     tags: [Products]
 *     summary: Obtener productos por categoría
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de productos de la categoría
 */
router.get('/category/:category', productController.getProductsByCategory)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Obtener producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', productController.getProductById)

export default router

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Actualizar producto (requiere autenticación admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               categoria:
 *                 type: string
 *               subcategoria:
 *                 type: string
 *               imagen_url:
 *                 type: string
 *               disponible:
 *                 type: boolean
 *               destacado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */
router.put('/:id', authenticateToken, requireAdmin, productController.updateProduct)

/**
 * @swagger
 * /api/products/{id}/toggle:
 *   patch:
 *     tags: [Products]
 *     summary: Activar/Desactivar producto (requiere autenticación admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Disponibilidad del producto cambiada
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */
router.patch('/:id/toggle', authenticateToken, requireAdmin, productController.toggleProductAvailability)
