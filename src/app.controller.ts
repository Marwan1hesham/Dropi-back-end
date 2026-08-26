import express, { Request, Response, NextFunction } from "express";
import { PORT } from "./config/config.service";
import {
  AppError,
  globalErrorHandler,
} from "./common/utils/global-error-handler";
import { checkConnectionDB } from "./DB/connectionDB";
import productRouter from "./modules/products/product.controller";
import adminRouter from "./modules/admin/admin.controller";
import cors from "cors";
import ordertRouter from "./modules/orders/order.controller";

const app = express();

const bootstrap = () => {
  app.use(express.json());

  app.use(
    cors({
      origin: ["http://localhost:5000", undefined!, "http://localhost:3000"],
    }),
  );

  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Welcome to Dropi store" });
  });

  checkConnectionDB();

  app.use("/admin", adminRouter);
  app.use("/products", productRouter);
  app.use("/orders", ordertRouter);

  app.use("/{*demo}", (req: Request, res: Response, next: NextFunction) => {
    throw new AppError(
      `Url ${req.method} ${req.originalUrl} is not found`,
      404,
    );
  });

  app.use(globalErrorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default bootstrap;
