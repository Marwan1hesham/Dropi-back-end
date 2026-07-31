import { Request, Response, NextFunction } from "express";
import { ProductRepository } from "../../DB/repository/product.repository";

class ProductService {
  private readonly _productRepo = new ProductRepository();

  constructor() {}

  addProduct = async (req: Request, res: Response, next: NextFunction) => {
    let { name, price, discount, status, stock } = req.body;
  };

  getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, discount, status } = req.body;
  };
}

export default new ProductService();
