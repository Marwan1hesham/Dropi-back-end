import mongoose, { Types } from "mongoose";
import { statusEnum } from "../../common/enum/product.enum";

export interface IProduct {
  name: string;
  price: number;
  image: string;
  discount: number;
  status: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
    },
    status: {
      type: String,
      enum: statusEnum,
      default: statusEnum.new,
    },
  },
  {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const ProductModel =
  (mongoose.models.Product as mongoose.Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default ProductModel;
