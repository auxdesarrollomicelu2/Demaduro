import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database.js'
import Sede from './Sede.js'
import OrderItem from './OrderItem.js'

interface OrderAttributes {
  id: number
  codigo: string
  sede_id: number
  tipo_entrega: 'domicilio' | 'recoger'
  cliente_nombre: string
  cliente_telefono: string
  cliente_email?: string
  barrio?: string
  tipo_vivienda?: string
  direccion_entrega?: string
  ubicacion_entrega?: string
  distancia_km?: number
  subtotal: number
  costo_domicilio: number
  total: number
  soporte_pago?: string
  metodo_pago?: string
  estado: string
  notas?: string
  token_confirmacion: string
  confirmado_at?: Date
  created_at?: Date
  updated_at?: Date
}

interface OrderCreationAttributes
  extends Optional<
    OrderAttributes,
    | 'id'
    | 'cliente_email'
    | 'barrio'
    | 'tipo_vivienda'
    | 'direccion_entrega'
    | 'ubicacion_entrega'
    | 'distancia_km'
    | 'soporte_pago'
    | 'metodo_pago'
    | 'notas'
    | 'confirmado_at'
    | 'created_at'
    | 'updated_at'
  > {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  declare id: number
  declare codigo: string
  declare sede_id: number
  declare tipo_entrega: 'domicilio' | 'recoger'
  declare cliente_nombre: string
  declare cliente_telefono: string
  declare cliente_email?: string
  declare barrio?: string
  declare tipo_vivienda?: string
  declare direccion_entrega?: string
  declare ubicacion_entrega?: string
  declare distancia_km?: number
  declare subtotal: number
  declare costo_domicilio: number
  declare total: number
  declare soporte_pago?: string
  declare metodo_pago?: string
  declare estado: string
  declare notas?: string
  declare token_confirmacion: string
  declare confirmado_at?: Date
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    sede_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sedes',
        key: 'id',
      },
    },
    tipo_entrega: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'domicilio',
    },
    cliente_nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    cliente_telefono: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    cliente_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    barrio: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tipo_vivienda: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    direccion_entrega: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ubicacion_entrega: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    distancia_km: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    costo_domicilio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    soporte_pago: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    metodo_pago: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING(50),
      defaultValue: 'pendiente',
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    token_confirmacion: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    confirmado_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'orders',
    schema:'dema',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
Order.belongsTo(Sede, { foreignKey: 'sede_id', as: 'sede' })
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' })

export default Order
