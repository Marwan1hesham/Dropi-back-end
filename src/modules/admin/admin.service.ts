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
      stock,
      colours,
      description,
      isFeatured,
      colors,
      sizes,
    } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const mainImage = files["main-image"]?.[0];
    const subImages = files["sub-images"] || [];

    if (!mainImage) {
      throw new AppError("Main image is required", 400);
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      mainImage.path,
      {
        folder: "dropi/main-images",
      },
    );

    let uploadedSubImages: {
      secure_url: string;
      public_id: string;
    }[] = [];

    if (subImages) {
      const uploadedImages = await Promise.all(
        subImages.map((file: Express.Multer.File) =>
          cloudinary.uploader.upload(file.path, {
            folder: "dropi/sub-images",
          }),
        ),
      );

      uploadedSubImages = uploadedImages.map(({ secure_url, public_id }) => ({
        secure_url,
        public_id,
      }));
    }

    if (discount) {
      price = (price * (discount || 0)) / 100;
    }

    const product = await this._productRepo.create({
      name,
      price,
      discount,
      category,
      stock,
      mainImage: { secure_url, public_id },
      subImages: uploadedSubImages,
      description,
      isFeatured,
      colors,
      sizes,
    });

    res.status(201).json({ message: "Done", data: { product } });
  };
}

export default new AdmiService();
