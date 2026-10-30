import { Router } from 'express'
import * as sedeController from '../controllers/sedeController.js'
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * /api/sedes:
 *   get:
 *     tags: [Sedes]
 *     summary: Obtener todas las sedes
 *     responses:
 *       200:
 *         description: Lista de sedes/locales
 */
router.get('/', sedeController.getSedes)

/**
 * @swagger
 * /api/sedes:
 *   post:
 *     tags: [Sedes]
 *     summary: Crear una nueva sede (requiere autenticación admin)
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
 *               - direccion
 *               - telefono
 *               - whatsapp
 *               - email_pedidos
 *               - abreviatura
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Demaduro Envigado
 *                 description: Nombre de la sede
 *               ciudad:
 *                 type: string
 *                 example: Envigado
 *               direccion:
 *                 type: string
 *                 example: Calle 40 Sur # 41-44 Edificio Murano Plaza
 *                 description: Dirección física de la sede (texto simple)
 *               telefono:
 *                 type: string
 *                 example: 3044040236
 *                 description: Teléfono de contacto
 *               whatsapp:
 *                 type: string
 *                 example: 573044040236
 *                 description: Número de WhatsApp para redirigir al bot (sin espacios ni +)
 *               email_pedidos:
 *                 type: string
 *                 example: envigado@demaduro.com
 *                 description: Email para enviar confirmaciones de pedidos
 *               coordenadas:
 *                 type: string
 *                 example: 6.1701,-75.5830
 *                 description: Coordenadas GPS en formato "lat,lng" (opcional)
 *               abreviatura:
 *                 type: string
 *                 example: ENV
 *                 description: Abreviatura única para el código de pedido (ej. ENV-0001)
 *               llave_breb:
 *                 type: string
 *                 description: Llave Bre-B para pagos por transferencia (opcional)
 *               qr_pago_url:
 *                 type: string
 *                 description: URL de la imagen del QR de pago (opcional)
 *     responses:
 *       201:
 *         description: Sede creada exitosamente
 *       400:
 *         description: Error de validación
 *       409:
 *         description: El ID de sede ya existe
 *       500:
 *         description: Error del servidor
 */
router.post('/', authenticateToken, requireAdmin, sedeController.createSede)

/**
 * @swagger
 * /api/sedes/{id}:
 *   get:
 *     tags: [Sedes]
 *     summary: Obtener sede por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Sede encontrada
 *       404:
 *         description: Sede no encontrada
 */
router.get('/:id', sedeController.getSedeById)

/**
 * @swagger
 * /api/sedes/delivery-cost:
 *   post:
 *     tags: [Sedes]
 *     summary: Calcular costo de domicilio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sede_id
 *               - address
 *             properties:
 *               sede_id:
 *                 type: integer
 *                 example: 1
 *               address:
 *                 type: string
 *                 example: Calle 40 Sur #41-44
 *     responses:
 *       200:
 *         description: Costo calculado
 */
router.post('/delivery-cost', sedeController.calculateDeliveryCost)

export default router

/**
 * @swagger
 * /api/sedes/{id}:
 *   put:
 *     tags: [Sedes]
 *     summary: Actualizar sede (requiere autenticación admin)
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
 *               ciudad:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *               whatsapp:
 *                 type: string
 *               email_pedidos:
 *                 type: string
 *               coordenadas:
 *                 type: string
 *               abreviatura:
 *                 type: string
 *               llave_breb:
 *                 type: string
 *               qr_pago_url:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Sede actualizada
 *       404:
 *         description: Sede no encontrada
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */
router.put('/:id', authenticateToken, requireAdmin, sedeController.updateSede)

/**
 * @swagger
 * /api/sedes/{id}/toggle:
 *   patch:
 *     tags: [Sedes]
 *     summary: Activar/Desactivar sede (requiere autenticación admin)
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
 *         description: Estado de la sede cambiado
 *       404:
 *         description: Sede no encontrada
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */
router.patch('/:id/toggle', authenticateToken, requireAdmin, sedeController.toggleSedeStatus)
