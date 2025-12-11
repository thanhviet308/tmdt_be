import { Router } from "express";
import ReviewController from "../../controllers/ReviewController.js";
import { authenticateToken } from "../../middlewares/auth.js";
import { requireAdmin } from "../../middlewares/authorization.js";

const router = Router();

// Admin routes - Quản lý đánh giá
router.get("/", authenticateToken, requireAdmin, ReviewController.getAllReviews);
router.patch("/:reviewId/toggle-approval", authenticateToken, requireAdmin, ReviewController.toggleApproval);
router.delete("/:reviewId", authenticateToken, requireAdmin, ReviewController.deleteReview);

export default router;

