"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const product_enum_1 = require("../../common/enum/product.enum");
const ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
    },
    status: {
        type: String,
        enum: product_enum_1.statusEnum,
        default: product_enum_1.statusEnum.new,
    },
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const ProductModel = mongoose_1.default.models.Product ||
    mongoose_1.default.model("Product", ProductSchema);
exports.default = ProductModel;
