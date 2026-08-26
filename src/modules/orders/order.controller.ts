import { Router } from "express";
import ordertService from "./order.service";
import multerCloud from "../../common/middleware/multer";
import { StoreEnum } from "../../common/enum/multer.enum";

const ordertRouter = Router();

ordertRouter.post(
  "/checkout",
  multerCloud({ store_type: StoreEnum.disk }).single("paymentScreenshot"),
  ordertService.placeOrder,
);

export default ordertRouter;
