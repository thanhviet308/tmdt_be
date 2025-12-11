import { Router } from "express";
import CouponController from "../../controllers/CouponController.js";
import { authenticateToken } from "../../middlewares/auth.js";
import { requireAdmin } from "../../middlewares/authorization.js";

const router = Router();

// Tất cả routes yêu cầu admin
router.use(authenticateToken, requireAdmin);

router.get("/", CouponController.getAllCoupons);
router.get("/:id", CouponController.getCouponById);
router.post("/", CouponController.createCoupon);
router.put("/:id", CouponController.updateCoupon);
router.delete("/:id", CouponController.deleteCoupon);

export default router;

