"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_service_1 = __importDefault(require("./order.service"));
const multer_1 = __importDefault(require("../../common/middleware/multer"));
const multer_enum_1 = require("../../common/enum/multer.enum");
const ordertRouter = (0, express_1.Router)();
ordertRouter.post("/checkout", (0, multer_1.default)({ store_type: multer_enum_1.StoreEnum.disk }).single("paymentScreenshot"), order_service_1.default.placeOrder);
exports.default = ordertRouter;
