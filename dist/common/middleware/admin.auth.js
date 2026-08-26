"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const global_error_handler_1 = require("../utils/global-error-handler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_service_1 = require("../../config/config.service");
const adminAuth = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        throw new global_error_handler_1.AppError("Token not found", 401);
    }
    try {
        jsonwebtoken_1.default.verify(token, config_service_1.ADMIN_SECRET_KEY);
        next();
    }
    catch (error) {
        throw new global_error_handler_1.AppError(error instanceof Error ? error.message : String(error), 401);
    }
};
exports.adminAuth = adminAuth;
