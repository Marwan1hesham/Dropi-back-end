import mongoose, { Types } from "mongoose";
import { OrderPayMethod, OrderStatusEnum } from "../../common/enum/order.enum";

export interface IOrder {
  firstName: string;
  lastName: string;
  phone: number;
  email: string;
  governorate: string;
  address: string;
  comments: string;
  productsIds: mongoose.Types.ObjectId[];
  status: string;
  orderNumber: number;
  paymentMethod: string;
  paymentScreenshot?: { secure_url: string; public_id: string };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    governorate: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    comments: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: OrderStatusEnum,
    },
    productsIds: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    orderNumber: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: OrderPayMethod,
    },
    paymentScreenshot: {
      secure_url: String,
      public_id: String,
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

const OrderModel =
  (mongoose.models.Order as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  sequence: {
    type: Number,
    default: 10000,
  },
});

export const CounterModel = mongoose.model("Counter", counterSchema);
