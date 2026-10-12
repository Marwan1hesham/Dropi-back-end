import { Router } from "express";
import { adminAuth } from "../../common/middleware/admin.auth";
import adminService from "./admin.service";
import multerCloud from "../../common/middleware/multer";
import { multer_types_enum, StoreEnum } from "../../common/enum/multer.enum";

const adminRouter = Router();

adminRouter.post("/login", adminService.login);

adminRouter.post(
  "/add-product",
  adminAuth,
  multerCloud({
    store_type: StoreEnum.disk,
    custom_types: multer_types_enum.image,
  }).any(),
  adminService.addProduct,
);

adminRouter.get("/get-products", adminAuth, adminService.getProducts);

adminRouter.patch("/update-product", adminAuth, adminService.updateProduct);

adminRouter.delete(
  "/delete-product/:productId",
  adminAuth,
  adminService.deleteProduct,
);

adminRouter.get("/get-orders", adminAuth, adminService.getOrders);

adminRouter.patch(
  "/update-order/:orderId",
  adminAuth,
  adminService.updateOrderStatus,
);

adminRouter.delete(
  "/delete-order/:orderId",
  adminAuth,
  adminService.deleteOrder,
);

export default adminRouter;
