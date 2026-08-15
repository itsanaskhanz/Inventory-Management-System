export enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export const getOrderPaymentStatus = (
  total: number,
  cashReceived: number,
): OrderStatus =>
  total - cashReceived <= 0 ? OrderStatus.COMPLETED : OrderStatus.PENDING;

export interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
  costPrice?: number;
}

export interface CreateOrderInput {
  customerId?: string | null;
  cashReceived?: number;
  products: OrderItemInput[];
}

export interface CreateOrderData extends CreateOrderInput {
  total: number;
  due: number;
  cashReceived: number;
  status: OrderStatus;
  userId: string;
}

export interface UpdateOrderInput {
  status?: OrderStatus;
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