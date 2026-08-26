"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_service_1 = require("../../config/config.service");
const global_error_handler_1 = require("../../common/utils/global-error-handler");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const product_repository_1 = require("../../DB/repository/product.repository");
const cloudinary_1 = __importDefault(require("../../common/utils/cloudinary"));
class AdmiService {
    _productRepo = new product_repository_1.ProductRepository();
    constructor() { }
    login = async (req, res, next) => {
        const { username, password } = req.body;
        if (username !== config_service_1.ADMIN_USERNAME ||
            !bcrypt_1.default.compareSync(password, config_service_1.ADMIN_PASSWORD)) {
            throw new global_error_handler_1.AppError("Invalid credentials", 401);
        }
        const access_token = jsonwebtoken_1.default.sign({ username: config_service_1.ADMIN_USERNAME, role: "Admin" }, config_service_1.ADMIN_SECRET_KEY, {
            expiresIn: "5h",
        });
        res.status(200).json({ message: "Done", data: { access_token } });
    };
    addProduct = async (req, res, next) => {
        let { name, price, discount, category, stock, colours, description, isFeatured, colors, sizes, } = req.body;
        const files = req.files;
        const mainImage = files["main-image"]?.[0];
        const subImages = files["sub-images"] || [];
        if (!mainImage) {
            throw new global_error_handler_1.AppError("Main image is required", 400);
        }
        const { secure_url, public_id } = await cloudinary_1.default.uploader.upload(mainImage.path, {
            folder: "dropi/main-images",
        });
        let uploadedSubImages = [];
        if (subImages) {
            const uploadedImages = await Promise.all(subImages.map((file) => cloudinary_1.default.uploader.upload(file.path, {
                folder: "dropi/sub-images",
            })));
            uploadedSubImages = uploadedImages.map(({ secure_url, public_id }) => ({
                secure_url,
                public_id,
            }));
        }
        if (discount) {
            price = (price * (discount || 0)) / 100;
        }
        const product = await this._productRepo.create({
            name,
            price,
            discount,
            category,
            stock,
            mainImage: { secure_url, public_id },
            subImages: uploadedSubImages,
            description,
            isFeatured,
            colors,
            sizes,
        });
        res.status(201).json({ message: "Done", data: { product } });
    };
}
exports.default = new AdmiService();
