import { Model } from "mongoose";
import ProductModel, { IProduct } from "../models/product.model";
import BaseRepository from "./base.repository";

export class ProductRepository extends BaseRepository<IProduct> {
  constructor(protected readonly model: Model<IProduct> = ProductModel) {
    super(model);
  }
}
