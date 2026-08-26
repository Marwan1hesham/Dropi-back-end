"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPayMethod = exports.OrderStatusEnum = void 0;
var OrderStatusEnum;
(function (OrderStatusEnum) {
    OrderStatusEnum["pending"] = "pending";
    OrderStatusEnum["paid"] = "paid";
    OrderStatusEnum["canceled"] = "canceled";
})(OrderStatusEnum || (exports.OrderStatusEnum = OrderStatusEnum = {}));
var OrderPayMethod;
(function (OrderPayMethod) {
    OrderPayMethod["cash"] = "cash";
    OrderPayMethod["online"] = "online";
})(OrderPayMethod || (exports.OrderPayMethod = OrderPayMethod = {}));
