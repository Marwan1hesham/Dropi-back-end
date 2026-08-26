import { Request, Response, NextFunction } from "express";
import { ProductRepository } from "../../DB/repository/product.repository";
import { object } from "joi";
import { AppError } from "../../common/utils/global-error-handler";

class ProductService {
  private readonly _productRepo = new ProductRepository();

  constructor() {}

  getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await this._productRepo.find();

    return res.status(200).json({ message: "Done", data: products });
  };

  getProductsByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { category } = req.params;

    if (typeof category !== "string") {
      throw new Error("Invalid category");
    }

    const products = await this._productRepo.find({
      filter: { category: category.trim().toLocaleLowerCase() },
    });

    if (!products) {
      throw new AppError("Invalid category");
    }

    res.status(200).json({ message: "Done", data: products });
  };
}

export default new ProductService();
