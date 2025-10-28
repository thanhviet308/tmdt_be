import { Product } from "../models/index.js";

// Repository layer for Product model
// Keeps all direct ORM calls in one place
const ProductRepository = {
    findAndCountAll: (options) => Product.findAndCountAll(options),
    findByPk: (id, options) => Product.findByPk(id, options),
    create: (data) => Product.create(data),
    updateInstance: (instance, data) => instance.update(data),
    destroyInstance: (instance) => instance.destroy(),
};

export default ProductRepository;
