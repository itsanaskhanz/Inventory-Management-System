import { User } from "./auth.types";
export interface IOrderProduct {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  orderId: string;
  order: Order;
  productId: string;
  product?: { id: string; name: string } | null;
}

export interface CreateOrderProduct {
  quantity: number;
  price: number;
  subtotal: number;
  productId: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  customerName?: string | null;
  customerPhone?: string | null;
  createdAt: Date;
  userId: string;
  user: User;
  products: IOrderProduct[];
}
export interface CreateOrder {
  orderNumber?: string;
  subtotal: number;
  tax: number;
  total: number;
  status?: string;
  userId?: string;
  customerName?: string;
  customerPhone?: string;
  products: CreateOrderProduct[];
}
