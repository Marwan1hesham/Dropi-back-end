import mongoose, { Types } from "mongoose";
import { statusEnum } from "../../common/enum/product.enum";

export interface IProduct {
  name: string;
  price: number;
  description: string;
  discount: number;
  status: string;
  category: string;
  colors: {
    color: string;
    hexCode?: string;

    mainImage: {
      secure_url: string;
      public_id: string;
    };

    subImages?: {
      secure_url: string;
      public_id: string;
    }[];
  }[];
  variants: {
    color: string;
    size: string;
    stock: number;
  }[];
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
    discount: {
      type: Number,
    },
    category: {
      type: String,
      required: true,
    },
    colors: [
      {
        color: {
          type: String,
        },
        hexCode: {
          type: String,
        },
        mainImage: {
          secure_url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
        subImages: [
          {
            secure_url: String,
            public_id: String,
          },
        ],
      },
    ],
    variants: [
      {
        color: String,
        size: String,
        stock: Number,
      },
    ],
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
