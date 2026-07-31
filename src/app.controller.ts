import express, { Request, Response, NextFunction } from "express";
import { PORT } from "./config/config.service";
import { AppError } from "./common/utils/global-error-handler";
import { checkConnectionDB } from "./DB/connectionDB";
import productRouter from "./modules/products/product.controller";

const app = express();

const bootstrap = () => {
  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Welcome to Dropi store" });
  });

  checkConnectionDB();

  app.use("/products", productRouter)

  app.use("/{*demo}", (req: Request, res: Response, next: NextFunction) => {
    throw new AppError(
      `Url ${req.method} ${req.originalUrl} is not found`,
      404,
    );
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default bootstrap;
