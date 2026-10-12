"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handler_1 = require("../../common/utils/global-error-handler");
const order_repository_1 = require("../../DB/repository/order.repository");
const order_enum_1 = require("../../common/enum/order.enum");
const cloudinary_1 = __importDefault(require("../../common/utils/cloudinary"));
const order_model_1 = require("../../DB/models/order.model");
const product_repository_1 = require("../../DB/repository/product.repository");
const mongoose_1 = __importDefault(require("mongoose"));
class OrderService {
    _orderRepo = new order_repository_1.OrderRepository();
    _productRepo = new product_repository_1.ProductRepository();
    constructor() { }
    // placeOrder = async (req: Request, res: Response, next: NextFunction) => {
    //   const {
    //     firstName,
    //     lastName,
    //     phone,
    //     email,
    //     governorate,
    //     address,
    //     comments,
    //     paymentMethod,
    //     products,
    //   } = req.body;
    //   let status = "";
    //   if (paymentMethod === OrderPayMethod.online) {
    //     status = OrderStatusEnum.pending;
    //     if (!req.file) {
    //       throw new AppError("Payment screenshot is required", 404);
    //     }
    //   } else {
    //     status = OrderStatusEnum.paid;
    //   }
    //   let imgResult = {};
    //   if (req.file) {
    //     imgResult = await cloudinary.uploader.upload(req.file?.path!, {
    //       folder: `/orders/${email}`,
    //     });
    //     if (paymentMethod === OrderPayMethod.cash) {
    //       throw new AppError("Cannot send a screenshot while paying cash");
    //     }
    //   }
    //   const { secure_url, public_id } = imgResult as {
    //     secure_url: string;
    //     public_id: string;
    //   };
    //   const counter = await CounterModel.findOneAndUpdate(
    //     { _id: "order" },
    //     { $inc: { sequence: 1 } },
    //     {
    //       new: true,
    //       upsert: true,
    //     },
    //   );
    //   const orderNumber = counter.sequence;
    //   const order = await this._orderRepo.create({
    //     firstName,
    //     lastName,
    //     phone,
    //     email,
    //     governorate,
    //     address,
    //     status,
    //     comments,
    //     paymentMethod,
    //     paymentScreenshot: { secure_url, public_id },
    //     products,
    //     orderNumber,
    //   });
    //   return res.status(201).json({ message: "Done", data: order });
    // };
    placeOrder = async (req, res, next) => {
        let { firstName, lastName, phone, email, governorate, address, comments, products, } = req.body;
        products = JSON.parse(products);
        if (!req.file) {
            throw new global_error_handler_1.AppError("Payment screenshot is required", 404);
        }
        let imgResult = {};
        if (req.file) {
            imgResult = await cloudinary_1.default.uploader.upload(req.file.path, {
                folder: `/orders/${email}`,
            });
        }
        const { secure_url, public_id } = imgResult;
        // Stock Management
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            let total = 0;
            // Stock Management
            for (const item of products) {
                const { productId, color, size, quantity, price, productImage } = item;
                total += price;
                const product = await this._productRepo.findOneAndUpdate({
                    filter: {
                        _id: productId,
                        variants: {
                            $elemMatch: {
                                color,
                                size,
                                stock: { $gte: quantity },
                            },
                        },
                    },
                    update: {
                        $inc: {
                            "variants.$.stock": -quantity,
                        },
                    },
                    options: {
                        new: true,
                        session,
                    },
                });
                if (!product) {
                    throw new global_error_handler_1.AppError(`Not enough stock for ${color} - ${size}`, 400);
                }
            }
            const counter = await order_model_1.CounterModel.findOneAndUpdate({ _id: "order" }, { $inc: { sequence: 1 } }, {
                new: true,
                upsert: true,
                session,
            });
            const orderNumber = counter.sequence;
            const status = order_enum_1.OrderStatusEnum.pending;
            const order = await this._orderRepo.create({
                firstName,
                lastName,
                phone,
                email,
                governorate,
                address,
                status,
                comments,
                total,
                ...(req.file && {
                    paymentScreenshot: {
                        secure_url,
                        public_id,
                    },
                }),
                products,
                orderNumber,
            }, session);
            await session.commitTransaction();
            return res.status(201).json({
                message: "Done",
                data: order,
            });
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    };
}
exports.default = new OrderService();
