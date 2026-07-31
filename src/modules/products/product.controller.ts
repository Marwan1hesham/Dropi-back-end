import { Router } from "express";
import productService from "./product.service";

const productRouter = Router();

productRouter.post("/add-product", productService.addProduct);

productRouter.get("/", productService.getAllProducts);

export default productRouter;
