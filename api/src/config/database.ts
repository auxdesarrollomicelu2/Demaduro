import { Sequelize } from 'sequelize'
import { config } from './config.js'

const isDevelopment = config.nodeEnv === 'development'

const dbConfig = {
  dialect: 'postgres' as const,
  logging: isDevelopment ? console.log : false,
  timezone: '-05:00', // Hora de Colombia (UTC-5)
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: {
    schema: config.database.schema,
  },
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}

/**
 * Sequelize instance
 */
export const sequelize = new Sequelize(
  config.database.url,
  isDevelopment ? { ...dbConfig, dialectOptions: undefined } : dbConfig
)

/**
 * Test database connection
 */
export async function connectDB(): Promise<void> {
  try {
    await sequelize.authenticate()
    console.log('✅ Conectado a PostgreSQL con Sequelize')
    
    // Set timezone for the session
    await sequelize.query(`SET TIME ZONE 'America/Bogota'`)
    console.log(`✅ Timezone configurado: America/Bogota`)
    
    // Set search_path to use the schema
    await sequelize.query(`SET search_path TO ${config.database.schema}, public`)
    console.log(`✅ Schema "${config.database.schema}" configurado`)
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error)
    process.exit(1)
  }
}

export default sequelize
