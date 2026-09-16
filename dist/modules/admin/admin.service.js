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
        let { name, price, discount, category, variants, colors, description, isFeatured, } = req.body;
        price = Number(price);
        discount = Number(discount);
        colors = JSON.parse(colors);
        variants = JSON.parse(variants);
        isFeatured = isFeatured === "true";
        const files = req.files;
        const colorsWithImages = await Promise.all(colors.map(async (color, index) => {
            const mainImage = files.find((file) => file.fieldname === `main-image-${index}`);
            const subImages = files.filter((file) => file.fieldname === `sub-images-${index}`);
            if (!mainImage) {
                throw new global_error_handler_1.AppError(`Main image is required for ${color.color}`, 400);
            }
            const mainResult = await cloudinary_1.default.uploader.upload(mainImage.path, {
                folder: `dropi/products/${color.color}/main`,
            });
            const uploadedSubImages = await Promise.all(subImages.map((file) => cloudinary_1.default.uploader.upload(file.path, {
                folder: `dropi/products/${color.color}/sub`,
            })));
            return {
                color: color.color,
                mainImage: {
                    secure_url: mainResult.secure_url,
                    public_id: mainResult.public_id,
                },
                subImages: uploadedSubImages.map(({ secure_url, public_id }) => ({
                    secure_url,
                    public_id,
                })),
            };
        }));
        if (discount) {
            price = price - (price * discount) / 100;
        }
        const product = await this._productRepo.create({
            name,
            price,
            discount,
            category,
            variants,
            isFeatured,
            colors: colorsWithImages,
            description,
        });
        return res.status(201).json({
            message: "Done",
            data: { product },
        });
    };
    getProducts = async (req, res, next) => {
        const { category, status } = req.query;
        let filter = {};
        if (typeof category === "string") {
            filter.category = category;
        }
        if (typeof status === "string") {
            filter.status = status;
        }
        const products = await this._productRepo.find({ filter });
        return res.status(200).json({ message: "Done", data: products });
    };
}
exports.default = new AdmiService();
