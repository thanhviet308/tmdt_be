import { Op } from "sequelize";
import { Product } from "../models/index.js";

function buildPaging({ page = 1, limit = 10 }) {
    const p = Math.max(1, parseInt(page));
    const l = Math.max(1, parseInt(limit));
    return { limit: l, offset: (p - 1) * l };
}

class ProductService {
    static async getPublicProducts({ page = 1, limit = 12, search = "", category = "", minPrice, maxPrice, sortBy = "createdAt", sortOrder = "DESC" }) {
        const where = {};
        if (search) where.name = { [Op.iLike]: `%${search}%` };
        if (category) where.category = category;
        if (minPrice != null) where.price = { ...(where.price || {}), [Op.gte]: Number(minPrice) };
        if (maxPrice != null) where.price = { ...(where.price || {}), [Op.lte]: Number(maxPrice) };

        const { limit: l, offset } = buildPaging({ page, limit });
        const { count, rows } = await Product.findAndCountAll({
            where,
            limit: l,
            offset,
            order: [[sortBy, String(sortOrder).toUpperCase() === "ASC" ? "ASC" : "DESC"]],
            attributes: ["id", "name", "price", "image", "category", "createdAt", "updatedAt"],
        });
        const totalPages = Math.ceil(count / l) || 1;
        return {
            products: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: count,
                itemsPerPage: l,
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1,
            },
        };
    }

    static async getPublicProductById(id) {
        return this.getProductById(id);
    }
    static async getAllProducts({ page = 1, limit = 10, search = "", category = "", sortBy = "createdAt", sortOrder = "DESC" }) {
        const where = {};
        if (search) where.name = { [Op.iLike]: `%${search}%` };
        if (category) where.category = category;

        const { limit: l, offset } = buildPaging({ page, limit });

        const { count, rows } = await Product.findAndCountAll({
            where,
            limit: l,
            offset,
            order: [[sortBy, String(sortOrder).toUpperCase() === "ASC" ? "ASC" : "DESC"]],
            attributes: [
                "id",
                "name",
                "price",
                "image",
                "description",
                "category",
                "quantity",
                "cost",
                "profitPercent",
                "weight",
                "createdAt",
                "updatedAt",
            ],
        });

        const totalPages = Math.ceil(count / l) || 1;
        return {
            products: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: count,
                itemsPerPage: l,
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1,
            },
        };
    }

    static async createProduct(data) {
        if (!data?.name || !data?.price) {
            throw new Error("validation: name and price are required");
        }
        if (Number(data.price) <= 0) {
            throw new Error("validation: price must be > 0");
        }

        const payload = {
            name: String(data.name).trim(),
            price: Number(data.price),
            image: data.image || null,
            description: data.description || null,
            category: data.category || null,
            quantity: data.quantity != null ? parseInt(data.quantity) : 0,
            cost: data.cost != null ? Number(data.cost) : null,
            profitPercent: data.profitPercent != null ? Number(data.profitPercent) : null,
            weight: data.weight != null ? Number(data.weight) : null,
        };

        const created = await Product.create(payload);
        return created;
    }

    static async getProductById(id) {
        const productId = parseInt(id);
        if (Number.isNaN(productId)) return null;
        return Product.findByPk(productId);
    }

    static async updateProduct(id, updates) {
        const product = await this.getProductById(id);
        if (!product) return null;

        if (updates.price != null && Number(updates.price) <= 0) {
            throw new Error("validation: price must be > 0");
        }
        if (updates.quantity != null && Number(updates.quantity) < 0) {
            throw new Error("validation: quantity must be >= 0");
        }

        const data = {};
        if (updates.name !== undefined) data.name = String(updates.name).trim();
        if (updates.price !== undefined) data.price = Number(updates.price);
        if (updates.image !== undefined) data.image = updates.image;
        if (updates.description !== undefined) data.description = updates.description;
        if (updates.category !== undefined) data.category = updates.category;
        if (updates.quantity !== undefined) data.quantity = parseInt(updates.quantity);
        if (updates.cost !== undefined) data.cost = updates.cost != null ? Number(updates.cost) : null;
        if (updates.profitPercent !== undefined) data.profitPercent = updates.profitPercent != null ? Number(updates.profitPercent) : null;
        if (updates.weight !== undefined) data.weight = updates.weight != null ? Number(updates.weight) : null;

        await product.update(data);
        return product;
    }

    static async deleteProduct(id) {
        const product = await this.getProductById(id);
        if (!product) return false;
        await product.destroy();
        return true;
    }
}

export default ProductService;
