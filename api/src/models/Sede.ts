import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database.js'

interface SedeAttributes {
  id: number
  nombre: string
  ciudad?: string
  direccion: string
  telefono: string
  whatsapp: string
  email_pedidos: string
  coordenadas?: string
  abreviatura: string
  llave_breb?: string
  qr_pago_url?: string
  activo: boolean
  created_at?: Date
  updated_at?: Date
}

interface SedeCreationAttributes extends Optional<SedeAttributes, 'id' | 'ciudad' | 'coordenadas' | 'llave_breb' | 'qr_pago_url' | 'activo' | 'created_at' | 'updated_at'> {}

class Sede extends Model<SedeAttributes, SedeCreationAttributes> implements SedeAttributes {
  declare id: number
  declare nombre: string
  declare ciudad?: string
  declare direccion: string
  declare telefono: string
  declare whatsapp: string
  declare email_pedidos: string
  declare coordenadas?: string
  declare abreviatura: string
  declare llave_breb?: string
  declare qr_pago_url?: string
  declare activo: boolean
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

Sede.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ciudad: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    whatsapp: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email_pedidos: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    coordenadas: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    abreviatura: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: true,
    },
    llave_breb: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    qr_pago_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'sedes',
    schema:'dema',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

export default Sede
