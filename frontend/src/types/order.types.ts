import { User } from "./auth.types";

export interface OrderCustomer {
  id: string;
  name?: string | null;
  phone?: string | null;
}

export interface IOrderProduct {
  id: string;
  quantity: number;
  price: number;
  costPrice: number;
  orderId: string;
  order: Order;
  productId: string;
  product?: { id: string; name: string } | null;
}

export interface CreateOrderProduct {
  quantity: number;
  price: number;
  costPrice: number;
  productId: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  quantity: number;
  stock: number;
}

export interface Order {
  id: string;
  total: number;
  cashReceived: number;
  due: number;
  status: string;
  customerId?: string | null;
  customer?: OrderCustomer | null;
  createdAt: Date;
  userId: string;
  user: User;
  products: IOrderProduct[];
}

export interface CreateOrder {
  total: number;
  cashReceived?: number;
  status?: string;
  userId?: string;
  customerId?: string;
  products: CreateOrderProduct[];
}
