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
const order_enum_1 = require("../../common/enum/order.enum");
const order_repository_1 = require("../../DB/repository/order.repository");
const promises_1 = require("node:fs/promises");
class AdmiService {
    _productRepo = new product_repository_1.ProductRepository();
    _orderRepo = new order_repository_1.OrderRepository();
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
        try {
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
        }
        finally {
            await Promise.all(files.map(async (file) => {
                if (file.path) {
                    await (0, promises_1.unlink)(file.path).catch((err) => {
                        console.error(`Failed to delete temporary file: ${file.path}`, err);
                    });
                }
            }));
        }
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
    updateProduct = async (req, res, next) => {
        const { productId } = req.body;
        const allowedFields = [
            "name",
            "price",
            "discount",
            "description",
            "status",
            "category",
            "colors",
            "variants",
            "isFeatured",
        ];
        const updateData = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }
        const updatedProduct = await this._productRepo.findOneAndUpdate({
            filter: { _id: productId },
            update: updateData,
        });
        if (!updatedProduct) {
            throw new global_error_handler_1.AppError("Product not found", 404);
        }
        return res.status(200).json({ message: "Done", data: updatedProduct });
    };
    deleteProduct = async (req, res, next) => {
        const { productId } = req.params;
        if (!productId) {
            throw new global_error_handler_1.AppError("Product ID not found", 404);
        }
        const deletedProduct = await this._productRepo.findOneAndDelete({
            filter: { _id: productId },
        });
        if (!deletedProduct) {
            throw new global_error_handler_1.AppError("Product not found", 400);
        }
        return res.status(200).json({ message: "Done", data: deletedProduct });
    };
    getOrders = async (req, res, next) => {
        const { status } = req.query;
        let orders;
        if (status === order_enum_1.OrderStatusEnum.paid ||
            status === order_enum_1.OrderStatusEnum.cancelled ||
            status === order_enum_1.OrderStatusEnum.pending) {
            orders = await this._orderRepo.find({
                filter: { status },
            });
        }
        if (!status) {
            orders = await this._orderRepo.find();
        }
        return res.status(200).json({ message: "Done", data: orders });
    };
    updateOrderStatus = async (req, res, next) => {
        const { status } = req.body;
        const { orderId } = req.params;
        if (!orderId) {
            throw new global_error_handler_1.AppError("Order ID not found", 404);
        }
        const updatedOrder = await this._orderRepo.findOneAndUpdate({
            filter: { _id: orderId },
            update: { status },
            options: { new: true },
        });
        if (!status) {
            throw new global_error_handler_1.AppError("A status should be selected", 404);
        }
        if (!updatedOrder) {
            throw new global_error_handler_1.AppError("Order not found");
        }
        res.status(200).json({ message: "Done", data: updatedOrder });
    };
    deleteOrder = async (req, res, next) => {
        const { orderId } = req.params;
        if (!orderId) {
            throw new global_error_handler_1.AppError("Order ID not found", 404);
        }
        const deletedOrder = await this._orderRepo.findOneAndDelete({
            filter: { _id: orderId },
        });
        if (!deletedOrder) {
            throw new global_error_handler_1.AppError("Order not found", 400);
        }
        return res.status(200).json({ message: "Done", data: deletedOrder });
    };
}
exports.default = new AdmiService();
