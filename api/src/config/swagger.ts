import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Demaduro API',
      version: '1.0.0',
      description: 'API REST para el sistema de pedidos de Demaduro',
      contact: {
        name: 'Demaduro Team',
        email: 'dev@demaduro.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desarrollo',
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Autenticación y autorización con JWT',
      },
      {
        name: 'Products',
        description: 'Gestión de productos del menú',
      },
      {
        name: 'Sedes',
        description: 'Gestión de sedes/locales',
      },
      {
        name: 'Orders',
        description: 'Gestión de pedidos',
      },
      {
        name: 'Users',
        description: 'Gestión de usuarios (admin/vendedores)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del endpoint /api/auth/login',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
}

export const swaggerSpec = swaggerJsdoc(options)
