"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_service_1 = require("./config/config.service");
const global_error_handler_1 = require("./common/utils/global-error-handler");
const connectionDB_1 = require("./DB/connectionDB");
const product_controller_1 = __importDefault(require("./modules/products/product.controller"));
const app = (0, express_1.default)();
const bootstrap = () => {
    app.get("/", (req, res, next) => {
        res.status(200).json({ message: "Welcome to Dropi store" });
    });
    (0, connectionDB_1.checkConnectionDB)();
    app.use("/products", product_controller_1.default);
    app.use("/{*demo}", (req, res, next) => {
        throw new global_error_handler_1.AppError(`Url ${req.method} ${req.originalUrl} is not found`, 404);
    });
    app.listen(config_service_1.PORT, () => {
        console.log(`Server is running on port ${config_service_1.PORT}`);
    });
};
exports.default = bootstrap;
