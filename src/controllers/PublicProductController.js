import ProductService from "../services/ProductService.js";
import { successResponse, errorResponse } from "../utils/response.js";

class PublicProductController {
    static async list(req, res) {
        try {
            const { page, limit, search, category, minPrice, maxPrice, sortBy, sortOrder } = req.query;
            const data = await ProductService.getPublicProducts({ page, limit, search, category, minPrice, maxPrice, sortBy, sortOrder });
            return successResponse(res, "Danh sách sản phẩm", data);
        } catch (err) {
            return errorResponse(res, err.message || "Không lấy được danh sách sản phẩm", 400, err);
        }
    }

    static async detail(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductService.getPublicProductById(id);
            if (!product) return errorResponse(res, "Không tìm thấy sản phẩm", 404);
            return successResponse(res, "Chi tiết sản phẩm", product);
        } catch (err) {
            return errorResponse(res, err.message || "Không lấy được chi tiết sản phẩm", 400, err);
        }
    }
}

export default PublicProductController;
