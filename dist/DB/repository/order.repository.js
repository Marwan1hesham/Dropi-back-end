"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const base_repository_1 = __importDefault(require("./base.repository"));
class OrderRepository extends base_repository_1.default {
    model;
    constructor(model = order_model_1.default) {
        super(model);
        this.model = model;
    }
}
exports.OrderRepository = OrderRepository;
