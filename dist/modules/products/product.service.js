"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_repository_1 = require("../../DB/repository/product.repository");
class ProductService {
    _productRepo = new product_repository_1.ProductRepository();
    constructor() { }
    getAllProducts = async (req, res, next) => {
        const { name, price, discount, status } = req.body;
    };
}
exports.default = new ProductService();
