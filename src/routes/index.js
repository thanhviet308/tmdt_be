import express from "express";
import adminProductRoutes from "./admin/products.js";
import adminUserRoutes from "./admin/users.js";
import adminOrderRoutes from "./admin/orders.js";
import authRoutes from "./auth.js";
import publicProductRoutes from "./products.js";

const router = express.Router();

// Mount group routes
router.use("/admin", adminProductRoutes);
router.use("/admin", adminUserRoutes);
router.use("/admin", adminOrderRoutes);
router.use("/auth", authRoutes);
router.use("/products", publicProductRoutes);

export default router;
