import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/database.js'

interface UserAttributes {
  id: number
  nombre: string
  apellido: string
  email: string
  password: string
  rol: 'admin' | 'vendedorTienda'
  sede_id?: number
  activo: boolean
  created_at?: Date
  updated_at?: Date
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at' | 'sede_id' | 'activo'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number
  declare nombre: string
  declare apellido: string
  declare email: string
  declare password: string
  declare rol: 'admin' | 'vendedorTienda'
  declare sede_id?: number
  declare activo: boolean
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

User.init(
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
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['admin', 'vendedorTienda']],
      },
    },
    sede_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sedes',
        key: 'id',
      },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: 'users',
    schema: 'dema',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

export default User
