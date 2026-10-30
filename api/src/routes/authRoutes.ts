import { Router } from 'express'
import * as authController from '../controllers/authController.js'

const router = Router()

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Iniciar sesión y obtener token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@demaduro.com
 *                 description: Email del usuario
 *               password:
 *                 type: string
 *                 example: password123
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT token válido por 8 horas
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         nombre:
 *                           type: string
 *                         apellido:
 *                           type: string
 *                         email:
 *                           type: string
 *                         rol:
 *                           type: string
 *                         sedeId:
 *                           type: string
 *       401:
 *         description: Credenciales inválidas
 *       403:
 *         description: Usuario inactivo
 */
router.post('/login', authController.login)

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     tags: [Authentication]
 *     summary: Verificar validez del token JWT
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido o expirado
 */
router.get('/verify', authController.verify)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Cerrar sesión (cliente debe eliminar el token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout exitoso
 */
router.post('/logout', authController.logout)

export default router
