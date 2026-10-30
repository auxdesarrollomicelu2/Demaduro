import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database.js'

interface ProductAttributes {
  id: number
  nombre: string
  precio: number
  categoria: string
  subcategoria?: string
  descripcion?: string
  imagen_url?: string
  disponible: boolean
  destacado: boolean
  created_at?: Date
  updated_at?: Date
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'created_at' | 'updated_at' | 'subcategoria' | 'descripcion' | 'imagen_url' | 'destacado'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  declare id: number
  declare nombre: string
  declare precio: number
  declare categoria: string
  declare subcategoria?: string
  declare descripcion?: string
  declare imagen_url?: string
  declare disponible: boolean
  declare destacado: boolean
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    subcategoria: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagen_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    destacado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'products',
    schema:'dema',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

export default Product
