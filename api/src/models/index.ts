import Sede from './Sede.js'
import Product from './Product.js'
import Order from './Order.js'
import OrderItem from './OrderItem.js'
import User from './User.js'

// Relationships
User.belongsTo(Sede, { foreignKey: 'sede_id', as: 'sede' })

export { Sede, Product, Order, OrderItem, User }
