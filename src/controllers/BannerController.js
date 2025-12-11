import BannerService from "../services/BannerService.js";
import { successResponse, errorResponse } from "../utils/response.js";

class BannerController {
    // ============ PUBLIC ROUTES ============

    // GET /api/banners - Lấy banner active (cho frontend)
    async getActiveBanners(req, res) {
        try {
            const { type } = req.query || {};
            const banners = await BannerService.getActiveBanners(type);
            return successResponse(res, "Lấy danh sách banner thành công", banners);
        } catch (err) {
            return errorResponse(res, err.message || "Lỗi khi lấy banner", 500);
        }
    }

    // ============ ADMIN ROUTES ============

    // GET /api/admin/banners - Lấy tất cả banner
    async getAllBanners(req, res) {
        try {
            const result = await BannerService.getAllBanners(req.query || {});
            return successResponse(res, "Lấy danh sách banner thành công", result);
        } catch (err) {
            return errorResponse(res, err.message || "Lỗi khi lấy danh sách banner", 500);
        }
    }

    // GET /api/admin/banners/:id - Lấy chi tiết banner
    async getBannerById(req, res) {
        try {
            const banner = await BannerService.getBannerById(req.params?.id);
            if (!banner) return errorResponse(res, "Không tìm thấy banner", 404);
            return successResponse(res, "Lấy chi tiết banner thành công", banner);
        } catch (err) {
            return errorResponse(res, err.message || "Lỗi khi lấy chi tiết banner", 500);
        }
    }

    // POST /api/admin/banners - Tạo banner mới
    async createBanner(req, res) {
        try {
            const banner = await BannerService.createBanner(req.body || {});
            return successResponse(res, "Tạo banner thành công", banner, 201);
        } catch (err) {
            const msg = String(err.message || "");
            const statusCode = msg.startsWith("validation") ? 400 : 500;
            return errorResponse(res, err.message || "Lỗi khi tạo banner", statusCode);
        }
    }

    // PUT /api/admin/banners/:id - Cập nhật banner
    async updateBanner(req, res) {
        try {
            const banner = await BannerService.updateBanner(req.params?.id, req.body || {});
            if (!banner) return errorResponse(res, "Không tìm thấy banner", 404);
            return successResponse(res, "Cập nhật banner thành công", banner);
        } catch (err) {
            return errorResponse(res, err.message || "Lỗi khi cập nhật banner", 500);
        }
    }

    // DELETE /api/admin/banners/:id - Xóa banner
    async deleteBanner(req, res) {
        try {
            const ok = await BannerService.deleteBanner(req.params?.id);
            if (!ok) return errorResponse(res, "Không tìm thấy banner", 404);
            return successResponse(res, "Xóa banner thành công", { deletedId: parseInt(req.params?.id) });
        } catch (err) {
            return errorResponse(res, err.message || "Lỗi khi xóa banner", 500);
        }
    }

    // PATCH /api/admin/banners/:id/toggle - Toggle trạng thái active
    async toggleActive(req, res) {
        try {
            const banner = await BannerService.toggleActive(req.params?.id);
            if (!banner) return errorResponse(res, "Không tìm thấy banner", 404);
            return successResponse(res, `Banner đã ${banner.isActive ? "bật" : "tắt"}`, banner);
        } catch (err) {
            return errorResponse(res, err.message || "Lỗi khi thay đổi trạng thái", 500);
        }
    }
}

export default new BannerController();

