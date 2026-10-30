import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  database: {
    url: process.env.DB_URL || '',
    schema: process.env.DB_SCHEMA || 'dema',
  },
}
