import { Op } from "sequelize";
import { sequelize, Order, OrderDetail, User, Product } from "../models/index.js";

const ALLOWED_STATUSES = ["PENDING", "SHIPPING", "COMPLETE", "CANCEL"];

function paging({ page = 1, limit = 10 }) {
    const p = Math.max(1, parseInt(page));
    const l = Math.max(1, parseInt(limit));
    return { limit: l, offset: (p - 1) * l };
}

class OrderService {
    static async getOrders({ page = 1, limit = 10, status, userId, search = "", sortBy = "createdAt", sortOrder = "DESC" }) {
        const where = {};
        if (status && ALLOWED_STATUSES.includes(String(status).toUpperCase())) {
            where.status = String(status).toUpperCase();
        }
        if (userId) where.userId = parseInt(userId);
        if (search) {
            where[Op.or] = [
                { recipientName: { [Op.iLike]: `%${search}%` } },
                { recipientPhone: { [Op.iLike]: `%${search}%` } },
                { shippingAddress: { [Op.iLike]: `%${search}%` } },
            ];
        }

        const { limit: l, offset } = paging({ page, limit });

        const { count, rows } = await Order.findAndCountAll({
            where,
            include: [
                { model: User, as: "user", attributes: ["id", "email", "fullName"] },
            ],
            order: [[sortBy, String(sortOrder).toUpperCase() === "ASC" ? "ASC" : "DESC"]],
            limit: l,
            offset,
            attributes: [
                "id",
                "userId",
                "status",
                "totalPrice",
                "shippingAddress",
                "recipientPhone",
                "recipientName",
                "createdAt",
                "updatedAt",
            ],
        });

        const totalPages = Math.ceil(count / l) || 1;
        return {
            orders: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: count,
                itemsPerPage: l,
            },
        };
    }

    static async getOrderById(id) {
        const orderId = parseInt(id);
        if (Number.isNaN(orderId)) return null;
        return Order.findByPk(orderId, {
            include: [
                { model: User, as: "user", attributes: ["id", "email", "fullName"] },
                {
                    model: OrderDetail,
                    as: "orderDetails",
                    include: [{ model: Product, as: "product", attributes: ["id", "name", "price", "image"] }],
                },
            ],
        });
    }

    static async updateOrderStatus(id, status) {
        const next = String(status || "").toUpperCase();
        if (!ALLOWED_STATUSES.includes(next)) {
            throw new Error("validation: invalid status (PENDING, SHIPPING, COMPLETE, CANCEL)");
        }
        const order = await Order.findByPk(parseInt(id));
        if (!order) return null;
        await order.update({ status: next });
        return this.getOrderById(order.id);
    }

    static async deleteOrder(id) {
        const orderId = parseInt(id);
        const order = await Order.findByPk(orderId);
        if (!order) return false;

        return await sequelize.transaction(async (t) => {
            await OrderDetail.destroy({ where: { orderId }, transaction: t });
            await order.destroy({ transaction: t });
            return true;
        });
    }
}

export default OrderService;
