import { Router } from "express";
import BannerController from "../../controllers/BannerController.js";
import { authenticateToken } from "../../middlewares/auth.js";
import { requireAdmin } from "../../middlewares/authorization.js";
import { uploadBannerImage } from "../../middlewares/upload.js";

const router = Router();

// Tất cả routes yêu cầu admin
router.use(authenticateToken, requireAdmin);

// GET /api/admin/banners - Lấy tất cả banner
router.get("/", (req, res) => BannerController.getAllBanners(req, res));

// GET /api/admin/banners/:id - Lấy chi tiết banner
router.get("/:id", (req, res) => BannerController.getBannerById(req, res));

// POST /api/admin/banners - Tạo banner mới (có upload ảnh)
router.post("/", uploadBannerImage.single("image"), (req, res) => {
    // Nếu có file upload, gán đường dẫn vào body
    if (req.file) {
        req.body.image = `/uploads/banners/${req.file.filename}`;
    }
    BannerController.createBanner(req, res);
});

// PUT /api/admin/banners/:id - Cập nhật banner
router.put("/:id", uploadBannerImage.single("image"), (req, res) => {
    if (req.file) {
        req.body.image = `/uploads/banners/${req.file.filename}`;
    }
    BannerController.updateBanner(req, res);
});

// DELETE /api/admin/banners/:id - Xóa banner
router.delete("/:id", (req, res) => BannerController.deleteBanner(req, res));

// PATCH /api/admin/banners/:id/toggle - Toggle active
router.patch("/:id/toggle", (req, res) => BannerController.toggleActive(req, res));

export default router;

