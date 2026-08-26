import { Model } from "mongoose";
import OrderModel, { IOrder } from "../models/order.model";
import BaseRepository from "./base.repository";

export class OrderRepository extends BaseRepository<IOrder> {
  constructor(protected readonly model: Model<IOrder> = OrderModel) {
    super(model);
  }
}
