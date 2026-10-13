import { Request, Response, NextFunction } from "express";
import {
  ADMIN_PASSWORD,
  ADMIN_SECRET_KEY,
  ADMIN_USERNAME,
} from "../../config/config.service";
import { AppError } from "../../common/utils/global-error-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ProductRepository } from "../../DB/repository/product.repository";
import cloudinary from "../../common/utils/cloudinary";
import { OrderStatusEnum } from "../../common/enum/order.enum";
import { OrderRepository } from "../../DB/repository/order.repository";
import { unlink } from "node:fs/promises";

class AdmiService {
  private readonly _productRepo = new ProductRepository();
  private readonly _orderRepo = new OrderRepository();

  constructor() {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (
      username !== ADMIN_USERNAME ||
      !bcrypt.compareSync(password, ADMIN_PASSWORD!)
    ) {
      throw new AppError("Invalid credentials", 401);
    }

    const access_token = jwt.sign(
      { username: ADMIN_USERNAME, role: "Admin" },
      ADMIN_SECRET_KEY!,
      {
        expiresIn: "5h",
      },
    );

    res.status(200).json({ message: "Done", data: { access_token } });
  };

  addProduct = async (req: Request, res: Response, next: NextFunction) => {
    let {
      name,
      price,
      discount,
      category,
      variants,
      colors,
      description,
      isFeatured,
    } = req.body;

    price = Number(price);
    discount = Number(discount);

    colors = JSON.parse(colors);
    variants = JSON.parse(variants);

    isFeatured = isFeatured === "true";

    const files = req.files as Express.Multer.File[];

    try {
      const colorsWithImages = await Promise.all(
        colors.map(
          async (
            color: { color: string; hexCode?: string },
            index: number,
          ) => {
            const mainImage = files.find(
              (file) => file.fieldname === `main-image-${index}`,
            );

            const subImages = files.filter(
              (file) => file.fieldname === `sub-images-${index}`,
            );

            if (!mainImage) {
              throw new AppError(
                `Main image is required for ${color.color}`,
                400,
              );
            }

            const mainResult = await cloudinary.uploader.upload(mainImage.path, {
              folder: `dropi/products/${color.color}/main`,
            });

            const uploadedSubImages = await Promise.all(
              subImages.map((file) =>
                cloudinary.uploader.upload(file.path, {
                  folder: `dropi/products/${color.color}/sub`,
                }),
              ),
            );

            return {
              color: color.color,
              ...(color.hexCode ? { hexCode: color.hexCode } : {}),

              mainImage: {
                secure_url: mainResult.secure_url,
                public_id: mainResult.public_id,
              },

              subImages: uploadedSubImages.map(({ secure_url, public_id }) => ({
                secure_url,
                public_id,
              })),
            };
          },
        ),
      );

      const product = await this._productRepo.create({
        name,
        price,
        discount,
        category,
        variants,
        isFeatured,
        colors: colorsWithImages,
        description,
      });

      return res.status(201).json({
        message: "Done",
        data: { product },
      });
    } finally {
      await Promise.all(
        files.map(async (file) => {
          if (file.path) {
            await unlink(file.path).catch((err) => {
              console.error(
                `Failed to delete temporary file: ${file.path}`,
                err,
              );
            });
          }
        }),
      );
    }
  };

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const { category, status } = req.query;

    let filter: any = {};

    if (typeof category === "string") {
      filter.category = category;
    }

    if (typeof status === "string") {
      filter.status = status;
    }

    const products = await this._productRepo.find({ filter });

    return res.status(200).json({ message: "Done", data: products });
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.body;

    const allowedFields = [
      "name",
      "price",
      "discount",
      "description",
      "status",
      "category",
      "colors",
      "variants",
      "isFeatured",
    ];

    const updateData: Record<string, any> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const updatedProduct = await this._productRepo.findOneAndUpdate({
      filter: { _id: productId },
      update: updateData,
    });

    if (!updatedProduct) {
      throw new AppError("Product not found", 404);
    }

    return res.status(200).json({ message: "Done", data: updatedProduct });
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;

    if (!productId) {
      throw new AppError("Product ID not found", 404);
    }

    const deletedProduct = await this._productRepo.findOneAndDelete({
      filter: { _id: productId },
    });

    if (!deletedProduct) {
      throw new AppError("Product not found", 400);
    }

    return res.status(200).json({ message: "Done", data: deletedProduct });
  };

  getOrders = async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.query;

    let orders: any;

    if (
      status === OrderStatusEnum.paid ||
      status === OrderStatusEnum.cancelled ||
      status === OrderStatusEnum.pending
    ) {
      orders = await this._orderRepo.find({
        filter: { status },
      });
    }

    if (!status) {
      orders = await this._orderRepo.find();
    }

    return res.status(200).json({ message: "Done", data: orders });
  };

  updateOrderStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { status } = req.body;
    const { orderId } = req.params;

    if (!orderId) {
      throw new AppError("Order ID not found", 404);
    }

    const updatedOrder = await this._orderRepo.findOneAndUpdate({
      filter: { _id: orderId },
      update: { status },
      options: { new: true },
    });

    if (!status) {
      throw new AppError("A status should be selected", 404);
    }

    if (!updatedOrder) {
      throw new AppError("Order not found");
    }

    res.status(200).json({ message: "Done", data: updatedOrder });
  };

  deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;

    if (!orderId) {
      throw new AppError("Order ID not found", 404);
    }

    const deletedOrder = await this._orderRepo.findOneAndDelete({
      filter: { _id: orderId },
    });

    if (!deletedOrder) {
      throw new AppError("Order not found", 400);
    }

    return res.status(200).json({ message: "Done", data: deletedOrder });
  };
}

export default new AdmiService();
