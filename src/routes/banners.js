import { Router } from "express";
import BannerController from "../controllers/BannerController.js";

const router = Router();

// GET /api/banners - Lấy banner active (public, không cần đăng nhập)
router.get("/", (req, res) => BannerController.getActiveBanners(req, res));

export default router;

