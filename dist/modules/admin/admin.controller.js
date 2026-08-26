"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_auth_1 = require("../../common/middleware/admin.auth");
const admin_service_1 = __importDefault(require("./admin.service"));
const multer_1 = __importDefault(require("../../common/middleware/multer"));
const multer_enum_1 = require("../../common/enum/multer.enum");
const adminRouter = (0, express_1.Router)();
adminRouter.post("/login", admin_service_1.default.login);
adminRouter.post("/add-product", admin_auth_1.adminAuth, (0, multer_1.default)({
    store_type: multer_enum_1.StoreEnum.disk,
    custom_types: multer_enum_1.multer_types_enum.image,
}).fields([
    { name: "main-image", maxCount: 1 },
    { name: "sub-images", maxCount: 5 },
]), admin_service_1.default.addProduct);
exports.default = adminRouter;
