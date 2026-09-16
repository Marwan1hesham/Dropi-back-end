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

class AdmiService {
  private readonly _productRepo = new ProductRepository();

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

    const colorsWithImages = await Promise.all(
      colors.map(async (color: { color: string }, index: number) => {
        const mainImage = files.find(
          (file) => file.fieldname === `main-image-${index}`,
        );

        const subImages = files.filter(
          (file) => file.fieldname === `sub-images-${index}`,
        );

        if (!mainImage) {
          throw new AppError(`Main image is required for ${color.color}`, 400);
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

          mainImage: {
            secure_url: mainResult.secure_url,
            public_id: mainResult.public_id,
          },

          subImages: uploadedSubImages.map(({ secure_url, public_id }) => ({
            secure_url,
            public_id,
          })),
        };
      }),
    );

    if (discount) {
      price = price - (price * discount) / 100;
    }

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
}

export default new AdmiService();
