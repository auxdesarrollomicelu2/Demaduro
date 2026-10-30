import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database.js'
import Product from './Product.js'

interface OrderItemAttributes {
  id: number
  order_id: number
  product_id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
  observaciones?: string
  created_at?: Date
}

interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id' | 'observaciones' | 'created_at'> {}

class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  declare id: number
  declare order_id: number
  declare product_id: number
  declare cantidad: number
  declare precio_unitario: number
  declare subtotal: number
  declare observaciones?: string
  declare readonly created_at: Date
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'order_items',
    schema:'dema',
    timestamps: false,
  }
)

// Relationships
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' })

export default OrderItem
