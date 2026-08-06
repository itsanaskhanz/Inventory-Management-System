export enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
  subtotal?: number;
}

export interface CreateOrderInput {
  tax: number;
  customerId?: string | null;
  cashReceived?: number;
  products: OrderItemInput[];
}

export interface CreateOrderData extends CreateOrderInput {
  subtotal: number;
  total: number;
  due: number;
  cashReceived: number;
  status: OrderStatus;
  userId: string;
}

export interface UpdateOrderInput {
  status?: OrderStatus;
  customerId?: string | null;
  cashReceived?: number;
  due?: number;
}

export interface OrderStatsData {
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  totalDues: number;
  rangeRevenue: number;
  rangeOrders: number;
  dailyRevenue: { date: string; revenue: number; orders: number }[];
}