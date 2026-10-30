import { Router } from 'express'
import * as userController from '../controllers/userController.js'
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js'

const router = Router()

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Obtener todos los usuarios (requiere autenticación admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos (requiere admin)
 */
router.get('/', authenticateToken, requireAdmin, userController.getUsers)

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener usuario por ID (requiere autenticación admin)
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
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos (requiere admin)
 */
router.get('/:id', authenticateToken, requireAdmin, userController.getUserById)

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Crear un nuevo usuario (requiere autenticación admin)
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
 *               - apellido
 *               - email
 *               - password
 *               - rol
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Admin
 *               apellido:
 *                 type: string
 *                 example: Demaduro
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@demaduro.com
 *               password:
 *                 type: string
 *                 example: Admin123!
 *               rol:
 *                 type: string
 *                 enum: [admin, vendedorTienda]
 *                 example: admin
 *               sede_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Email ya registrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos (requiere admin)
 */
router.post('/', authenticateToken, requireAdmin, userController.createUser)

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Actualizar usuario (requiere autenticación admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               email:
 *                 type: string
 *               rol:
 *                 type: string
 *               sede_id:
 *                 type: integer
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos (requiere admin)
 */
router.put('/:id', authenticateToken, requireAdmin, userController.updateUser)

/**
 * @swagger
 * /api/users/{id}/toggle-status:
 *   patch:
 *     tags: [Users]
 *     summary: Activar/Desactivar usuario (requiere autenticación admin)
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
 *         description: Estado actualizado
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos (requiere admin)
 */
router.patch('/:id/toggle-status', authenticateToken, requireAdmin, userController.toggleUserStatus)

export default router
