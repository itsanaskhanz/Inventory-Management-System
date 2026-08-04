export const ORDER_STATUSES = [
  "PENDING",
  "COMPLETED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const FULFILLED_ORDER_STATUSES = new Set<OrderStatus>(["COMPLETED"]);
