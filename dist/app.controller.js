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
const admin_controller_1 = __importDefault(require("./modules/admin/admin.controller"));
const cors_1 = __importDefault(require("cors"));
const order_controller_1 = __importDefault(require("./modules/orders/order.controller"));
const app = (0, express_1.default)();
const bootstrap = () => {
    app.use(express_1.default.json());
    const allowedOrigins = [
        "http://127.0.0.1:5500",
        "http://localhost:5000",
        "http://localhost:3000",
        config_service_1.FRONTEND_URL,
    ].filter((origin) => Boolean(origin));
    app.use((0, cors_1.default)({
        origin: allowedOrigins,
    }));
    app.get("/", (req, res, next) => {
        res.status(200).json({ message: "Welcome to Dropi store" });
    });
    (0, connectionDB_1.checkConnectionDB)();
    app.use("/admin", admin_controller_1.default);
    app.use("/products", product_controller_1.default);
    app.use("/orders", order_controller_1.default);
    app.use("/{*demo}", (req, res, next) => {
        throw new global_error_handler_1.AppError(`Url ${req.method} ${req.originalUrl} is not found`, 404);
    });
    app.use(global_error_handler_1.globalErrorHandler);
    app.listen(config_service_1.PORT, () => {
        console.log(`Server is running on port ${config_service_1.PORT}`);
    });
};
exports.default = bootstrap;
