import { IUser } from "../auth/auth.interface.js";

export interface IOrderProduct {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  orderId: string;
  order: IOrder;
  productId: string;
}

export interface ICreateOrderProduct {
  quantity: number;
  price: number;
  subtotal: number;
  productId: string;
}

export interface IOrder {
  id: string;
  subtotal: number;
  tax: number;
  total: number;
  cashReceived: number;
  due: number;
  status: string;
  customerId: string;
  customer: object;
  createdAt: Date;
  userId: string;
  user: IUser;
  products: IOrderProduct[];
}
export interface ICreateOrder {
  subtotal?: number;
  tax: number;
  total?: number;
  cashReceived?: number;
  due?: number;
  status?: string;
  userId?: string;
  customerId: string;
  products: ICreateOrderProduct[];
}

export type IUpdateOrder = Partial<
  Pick<ICreateOrder, "status" | "customerId" | "cashReceived" | "due">
>;
