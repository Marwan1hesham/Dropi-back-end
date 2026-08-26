import { Router } from "express";
import productService from "./product.service";
import { addProductSchema } from "./product.validation";

const productRouter = Router();

productRouter.get("/", productService.getAllProducts);

productRouter.get("/:category", productService.getProductsByCategory);

export default productRouter;
