"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProductSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const product_enum_1 = require("../../common/enum/product.enum");
exports.addProductSchema = {
    body: {
        stock: zod_1.default.number().min(1).max(100),
        category: zod_1.default.string(),
        status: zod_1.default.enum(product_enum_1.statusEnum).default(product_enum_1.statusEnum.new),
        discount: zod_1.default.number().min(1).max(100),
        price: zod_1.default.number().min(1).max(10000),
        name: zod_1.default.string(),
    },
    file: {
        attachment: zod_1.default.string(),
    },
    files: {
        attachments: zod_1.default.array(zod_1.default.string()),
    },
};
