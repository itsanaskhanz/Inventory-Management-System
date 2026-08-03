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
  orderNumber: string;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  customerName: string | null;
  customerPhone: string | null;
  createdAt: Date;
  userId: string;
  user: IUser;
  products: IOrderProduct[];
}
export interface ICreateOrder {
  orderNumber?: string;
  subtotal: number;
  tax: number;
  total: number;
  status?: string;
  userId?: string;
  customerName?: string;
  customerPhone?: string;
  products: ICreateOrderProduct[];
}
