"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const base_repository_1 = __importDefault(require("./base.repository"));
class ProductRepository extends base_repository_1.default {
    model;
    constructor(model = product_model_1.default) {
        super(model);
        this.model = model;
    }
}
exports.ProductRepository = ProductRepository;
