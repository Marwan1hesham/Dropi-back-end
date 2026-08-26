import { Request, Response, NextFunction } from "express";
import { object } from "joi";
import { AppError } from "../../common/utils/global-error-handler";
import { OrderRepository } from "../../DB/repository/order.repository";
import { OrderPayMethod, OrderStatusEnum } from "../../common/enum/order.enum";
import cloudinary from "../../common/utils/cloudinary";
import { CounterModel } from "../../DB/models/order.model";

class OrderService {
  private readonly _orderRepo = new OrderRepository();

  constructor() {}

  placeOrder = async (req: Request, res: Response, next: NextFunction) => {
    const {
      firstName,
      lastName,
      phone,
      email,
      governorate,
      address,
      comments,
      paymentMethod,
      productsIds,
    } = req.body;

    let status = "";
    if (paymentMethod === OrderPayMethod.online) {
      status = OrderStatusEnum.pending;

      if (!req.file) {
        throw new AppError("Payment screenshot is required", 404);
      }
    } else {
      status = OrderStatusEnum.paid;
    }

    let result = {};
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file?.path!, {
        folder: `/orders/${email}`,
      });

      if (paymentMethod === OrderPayMethod.cash) {
        throw new AppError("Cannot send a screenshot while paying cash");
      }
    }

    const { secure_url, public_id } = result as {
      secure_url: string;
      public_id: string;
    };

    const counter = await CounterModel.findOneAndUpdate(
      { _id: "order" },
      { $inc: { sequence: 1 } },
      {
        new: true,
        upsert: true,
      },
    );

    const orderNumber = counter.sequence;

    const order = await this._orderRepo.create({
      firstName,
      lastName,
      phone,
      email,
      governorate,
      address,
      status,
      comments,
      paymentMethod,
      paymentScreenshot: { secure_url, public_id },
      productsIds,
      orderNumber,
    });

    return res.status(201).json({ message: "Done", data: order });
  };
}

export default new OrderService();
