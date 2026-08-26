"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_service_1 = __importDefault(require("./product.service"));
const productRouter = (0, express_1.Router)();
productRouter.get("/", product_service_1.default.getAllProducts);
productRouter.get("/:category", product_service_1.default.getProductsByCategory);
exports.default = productRouter;
