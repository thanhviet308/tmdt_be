import { Op } from "sequelize";
import { Banner } from "../models/index.js";

class BannerService {
    /**
     * Lấy danh sách banner đang active (cho frontend)
     */
    static async getActiveBanners(type = null) {
        const now = new Date();
        const where = {
            isActive: true,
            [Op.or]: [
                { startDate: null },
                { startDate: { [Op.lte]: now } },
            ],
            [Op.and]: [
                {
                    [Op.or]: [
                        { endDate: null },
                        { endDate: { [Op.gte]: now } },
                    ],
                },
            ],
        };

        if (type) {
            where.type = type;
        }

        return Banner.findAll({
            where,
            order: [["position", "ASC"], ["createdAt", "DESC"]],
        });
    }

    /**
     * Lấy tất cả banner (cho admin)
     */
    static async getAllBanners({ page = 1, limit = 10, type = null, isActive = null }) {
        const where = {};
        
        if (type) where.type = type;
        if (isActive !== null) where.isActive = isActive;

        const p = Math.max(1, parseInt(page));
        const l = Math.max(1, parseInt(limit));
        const offset = (p - 1) * l;

        const { count, rows } = await Banner.findAndCountAll({
            where,
            order: [["position", "ASC"], ["createdAt", "DESC"]],
            limit: l,
            offset,
        });

        const totalPages = Math.ceil(count / l) || 1;

        return {
            banners: rows,
            pagination: {
                currentPage: p,
                totalPages,
                totalItems: count,
                itemsPerPage: l,
            },
        };
    }

    /**
     * Lấy banner theo ID
     */
    static async getBannerById(id) {
        const bannerId = parseInt(id);
        if (Number.isNaN(bannerId)) return null;
        return Banner.findByPk(bannerId);
    }

    /**
     * Tạo banner mới
     */
    static async createBanner(data) {
        if (!data?.title || !data?.image) {
            throw new Error("validation: title và image là bắt buộc");
        }

        const payload = {
            title: String(data.title).trim(),
            image: data.image,
            link: data.link || null,
            description: data.description || null,
            position: data.position != null ? parseInt(data.position) : 0,
            isActive: data.isActive !== false,
            startDate: data.startDate || null,
            endDate: data.endDate || null,
            type: data.type || "main",
        };

        return Banner.create(payload);
    }

    /**
     * Cập nhật banner
     */
    static async updateBanner(id, updates) {
        const banner = await this.getBannerById(id);
        if (!banner) return null;

        const data = {};
        if (updates.title !== undefined) data.title = String(updates.title).trim();
        if (updates.image !== undefined) data.image = updates.image;
        if (updates.link !== undefined) data.link = updates.link;
        if (updates.description !== undefined) data.description = updates.description;
        if (updates.position !== undefined) data.position = parseInt(updates.position);
        if (updates.isActive !== undefined) data.isActive = updates.isActive;
        if (updates.startDate !== undefined) data.startDate = updates.startDate;
        if (updates.endDate !== undefined) data.endDate = updates.endDate;
        if (updates.type !== undefined) data.type = updates.type;

        await banner.update(data);
        return banner;
    }

    /**
     * Xóa banner
     */
    static async deleteBanner(id) {
        const banner = await this.getBannerById(id);
        if (!banner) return false;
        await banner.destroy();
        return true;
    }

    /**
     * Toggle trạng thái active
     */
    static async toggleActive(id) {
        const banner = await this.getBannerById(id);
        if (!banner) return null;
        await banner.update({ isActive: !banner.isActive });
        return banner;
    }
}

export default BannerService;

