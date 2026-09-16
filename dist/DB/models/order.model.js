"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_enum_1 = require("../../common/enum/order.enum");
const OrderSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20,
    },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email",
        ],
    },
    governorate: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    comments: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: order_enum_1.OrderStatusEnum,
    },
    products: [
        {
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            color: {
                type: String,
                required: true,
            },
            size: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    orderNumber: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: order_enum_1.OrderPayMethod,
    },
    paymentScreenshot: {
        secure_url: String,
        public_id: String,
    },
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const OrderModel = mongoose_1.default.models.Order ||
    mongoose_1.default.model("Order", OrderSchema);
exports.default = OrderModel;
const counterSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true,
    },
    sequence: {
        type: Number,
        default: 10000,
    },
});
exports.CounterModel = mongoose_1.default.model("Counter", counterSchema);
