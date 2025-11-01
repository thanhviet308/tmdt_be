import { sequelize, Cart, CartDetail, Product } from "../models/index.js";

class CartService {
    static async getActiveCart(userId) {
        return Cart.findOne({
            where: { userId, status: "active" },
            include: [{ model: CartDetail, as: "cartDetails", include: [{ model: Product, as: "product" }] }],
        });
    }

    static async getOrCreateActiveCart(userId, t = null) {
        let cart = await Cart.findOne({ where: { userId, status: "active" }, transaction: t });
        if (!cart) {
            cart = await Cart.create({ userId, status: "active" }, { transaction: t });
        }
        return cart;
    }

    static async addItem(userId, productId, quantity = 1) {
        const q = Math.max(1, parseInt(quantity || 1));
        return await sequelize.transaction(async (t) => {
            const product = await Product.findByPk(parseInt(productId), { transaction: t });
            if (!product) throw new Error("Sản phẩm không tồn tại");

            const cart = await this.getOrCreateActiveCart(userId, t);

            // If item exists, increment quantity
            let detail = await CartDetail.findOne({ where: { cartId: cart.id, productId: product.id }, transaction: t });
            if (detail) {
                detail.quantity = (Number(detail.quantity) || 0) + q;
                detail.price = product.price;
                await detail.save({ transaction: t });
            } else {
                detail = await CartDetail.create({ cartId: cart.id, productId: product.id, quantity: q, price: product.price }, { transaction: t });
            }

            return this.getActiveCart(userId);
        });
    }

    static async updateItem(itemId, quantity) {
        const qty = parseInt(quantity || 0);
        const detail = await CartDetail.findByPk(parseInt(itemId));
        if (!detail) throw new Error("Cart item không tồn tại");
        if (qty <= 0) {
            await detail.destroy();
            return true;
        }
        detail.quantity = qty;
        await detail.save();
        return true;
    }

    static async removeItem(itemId) {
        const detail = await CartDetail.findByPk(parseInt(itemId));
        if (!detail) return false;
        await detail.destroy();
        return true;
    }
}

export default CartService;
