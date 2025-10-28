import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// Import model definitions
import RoleModel from "./role.js";
import UserModel from "./user.js";
import ProductModel from "./product.js";
import CartModel from "./cart.js";
import CartDetailModel from "./cart_detail.js";
import OrderModel from "./order.js";
import OrderDetailModel from "./order_detail.js";

// Initialize models
const Role = RoleModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const Product = ProductModel(sequelize, DataTypes);
const Cart = CartModel(sequelize, DataTypes);
const CartDetail = CartDetailModel(sequelize, DataTypes);
const Order = OrderModel(sequelize, DataTypes);
const OrderDetail = OrderDetailModel(sequelize, DataTypes);

// Define associations
// Role - User (1:N)
Role.hasMany(User, { foreignKey: "roleId", as: "users" });
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });

// User - Cart (1:N)
User.hasMany(Cart, { foreignKey: "userId", as: "carts" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

// Cart - CartDetail (1:N)
Cart.hasMany(CartDetail, { foreignKey: "cartId", as: "cartDetails" });
CartDetail.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

// Product - CartDetail (1:N)
Product.hasMany(CartDetail, { foreignKey: "productId", as: "cartDetails" });
CartDetail.belongsTo(Product, { foreignKey: "productId", as: "product" });

// User - Order (1:N)
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

// Order - OrderDetail (1:N)
Order.hasMany(OrderDetail, { foreignKey: "orderId", as: "orderDetails" });
OrderDetail.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Product - OrderDetail (1:N)
Product.hasMany(OrderDetail, { foreignKey: "productId", as: "orderDetails" });
OrderDetail.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Export models and sequelize instance
export {
    sequelize,
    Role,
    User,
    Product,
    Cart,
    CartDetail,
    Order,
    OrderDetail,
};

export default {
    sequelize,
    Role,
    User,
    Product,
    Cart,
    CartDetail,
    Order,
    OrderDetail,
};