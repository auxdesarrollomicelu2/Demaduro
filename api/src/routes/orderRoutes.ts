import { Router } from 'express'
import * as orderController from '../controllers/orderController.js'
import { authenticateToken, requireSede } from '../middleware/authMiddleware.js'
import { uploadPaymentProof } from '../middleware/uploadMiddleware.js'

const router = Router()

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Crear un nuevo pedido (público - no requiere autenticación)
 *     description: Los precios se calculan en el servidor. Genera el código del pedido (ej. LAU-0001) y envía el correo a la sede.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - sede_id
 *               - tipo_entrega
 *               - cliente_nombre
 *               - cliente_telefono
 *               - metodo_pago
 *               - items
 *             properties:
 *               sede_id:
 *                 type: integer
 *                 example: 2
 *               tipo_entrega:
 *                 type: string
 *                 enum: [domicilio, recoger]
 *               cliente_nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               cliente_telefono:
 *                 type: string
 *                 example: '573001234567'
 *               cliente_email:
 *                 type: string
 *                 example: juan@example.com
 *               barrio:
 *                 type: string
 *                 description: Requerido para domicilio
 *               tipo_vivienda:
 *                 type: string
 *                 enum: [Casa, Unidad residencial]
 *                 description: Requerido para domicilio
 *               direccion_entrega:
 *                 type: string
 *                 description: Requerido para domicilio
 *               notas:
 *                 type: string
 *               metodo_pago:
 *                 type: string
 *                 enum: [efectivo, transferencia]
 *               items:
 *                 type: string
 *                 description: JSON con los productos
 *                 example: '[{"product_id":4,"cantidad":1,"observaciones":"Bien asado","complementos":[]}]'
 *               comprobante:
 *                 type: string
 *                 format: binary
 *                 description: Imagen o PDF (máx. 5 MB). Requerido para transferencia
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Sede o producto no disponible
 */
router.post('/', uploadPaymentProof, orderController.createOrder)

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Obtener todos los pedidos (requiere autenticación)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sede_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *       401:
 *         description: No autenticado
 */
router.get('/', authenticateToken, orderController.getOrders)

/**
 * @swagger
 * /api/orders/sede/{sedeId}:
 *   get:
 *     tags: [Orders]
 *     summary: Obtener pedidos de una sede específica (requiere autenticación)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sedeId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, confirmado, preparando, entregado, cancelado]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Lista de pedidos de la sede
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos para ver esta sede
 */
router.get('/sede/:sedeId', authenticateToken, orderController.getOrdersBySede)

/**
 * @swagger
 * /api/orders/confirmacion/{codigo}:
 *   get:
 *     tags: [Orders]
 *     summary: Resumen del pedido para confirmarlo desde el correo
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: ARA-0001
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resumen del pedido
 *       404:
 *         description: Enlace no válido
 *   post:
 *     tags: [Orders]
 *     summary: Confirmar el pedido (botón "Confirmar pedido" del correo)
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pedido confirmado
 *       404:
 *         description: Enlace no válido
 */
router.get('/confirmacion/:codigo', orderController.getOrderConfirmation)
router.post('/confirmacion/:codigo', orderController.confirmOrder)

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Obtener pedido por ID (requiere autenticación)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido no encontrado
 *       401:
 *         description: No autenticado
 */
router.get('/:id', authenticateToken, orderController.getOrderById)

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Actualizar estado del pedido (requiere autenticación)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, confirmado, preparando, entregado, cancelado]
 *                 example: confirmado
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos para esta sede
 */
router.patch('/:id/status', authenticateToken, requireSede, orderController.updateOrderStatus)

export default router
