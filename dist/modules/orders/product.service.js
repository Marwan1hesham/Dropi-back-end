"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_repository_1 = require("../../DB/repository/product.repository");
const global_error_handler_1 = require("../../common/utils/global-error-handler");
class ProductService {
    _productRepo = new product_repository_1.ProductRepository();
    constructor() { }
    getAllProducts = async (req, res, next) => {
        const products = await this._productRepo.find();
        return res.status(200).json({ message: "Done", data: products });
    };
    getProductsByCategory = async (req, res, next) => {
        const { category } = req.params;
        if (typeof category !== "string") {
            throw new Error("Invalid category");
        }
        const products = await this._productRepo.find({
            filter: { category: category.trim().toLocaleLowerCase() },
        });
        if (!products) {
            throw new global_error_handler_1.AppError("Invalid category");
        }
        res.status(200).json({ message: "Done", data: products });
    };
}
exports.default = new ProductService();
