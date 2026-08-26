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
  }).fields([
    { name: "main-image", maxCount: 1 },
    { name: "sub-images", maxCount: 5 },
  ]),
  adminService.addProduct,
);

export default adminRouter;
