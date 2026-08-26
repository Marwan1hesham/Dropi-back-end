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
class OrderService {
    _orderRepo = new order_repository_1.OrderRepository();
    constructor() { }
    placeOrder = async (req, res, next) => {
        const { firstName, lastName, phone, email, governorate, address, comments, paymentMethod, productsIds, } = req.body;
        let status = "";
        if (paymentMethod === order_enum_1.OrderPayMethod.online) {
            status = order_enum_1.OrderStatusEnum.pending;
            if (!req.file) {
                throw new global_error_handler_1.AppError("Payment screenshot is required", 404);
            }
        }
        else {
            status = order_enum_1.OrderStatusEnum.paid;
        }
        let result = {};
        if (req.file) {
            result = await cloudinary_1.default.uploader.upload(req.file?.path, {
                folder: `/orders/${email}`,
            });
            if (paymentMethod === order_enum_1.OrderPayMethod.cash) {
                throw new global_error_handler_1.AppError("Cannot send a screenshot while paying cash");
            }
        }
        const { secure_url, public_id } = result;
        const counter = await order_model_1.CounterModel.findOneAndUpdate({ _id: "order" }, { $inc: { sequence: 1 } }, {
            new: true,
            upsert: true,
        });
        const orderNumber = counter.sequence;
        const order = await this._orderRepo.create({
            firstName,
            lastName,
            phone,
            email,
            governorate,
            address,
            status,
            comments,
            paymentMethod,
            paymentScreenshot: { secure_url, public_id },
            productsIds,
            orderNumber,
        });
        return res.status(201).json({ message: "Done", data: order });
    };
}
exports.default = new OrderService();
