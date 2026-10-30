import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'
import { connectDB } from './config/database.js'
import { config } from './config/config.js'

// Load environment variables
dotenv.config()

// Create Express app
const app: Application = express()
const PORT = config.port

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Demaduro API - Backend funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    database: 'connected', // TODO: Verificar conexión real
    timestamp: new Date().toISOString(),
  })
})

// Import routes
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import sedeRoutes from './routes/sedeRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import userRoutes from './routes/userRoutes.js'

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Demaduro API Docs',
}))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/sedes', sedeRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/users', userRoutes)

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    path: req.path,
  })
})

// Start server
async function startServer() {
  await connectDB()
  
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🍽️  DEMADURO API                                    ║
║                                                       ║
║   🚀 Servidor corriendo en:                          ║
║   📍 http://localhost:${PORT}                        ║
║   📚 Documentación: http://localhost:${PORT}/api-docs ║
║                                                       ║
║   🌍 Entorno: ${config.nodeEnv}                        ║
║   📅 ${new Date().toLocaleString('es-CO')}            ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `)
  })
}

startServer().catch(console.error)

export default app
