import mongoose, { Types } from "mongoose";
import { statusEnum } from "../../common/enum/product.enum";

export interface IProduct {
  name: string;
  price: number;
  description: string;
  mainImage: { secure_url: string; public_id: string };
  subImages?: { secure_url: string; public_id: string }[];
  discount: number;
  status: string;
  category: string;
  stock: number;
  colors: string[];
  sizes: string[];
  isFeatured: boolean;
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
    description: String,
    stock: {
      type: Number,
      required: true,
    },
    mainImage: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    subImages: [
      {
        secure_url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    discount: {
      type: Number,
    },
    category: {
      type: String,
      required: true,
    },
    colors: [String],
    sizes: [String],
    isFeatured: Boolean,
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
