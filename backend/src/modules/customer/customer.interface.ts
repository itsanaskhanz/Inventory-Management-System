export interface ICreateCustomer {
  name?: string;
  phone?: string;
  userId: string;
}

export type IUpdateCustomerData = Partial<
  Pick<ICreateCustomer, "name" | "phone">
>;

export interface CustomerPaymentSummary {
  totalOrders: number;
  totalAmount: number;
  totalCashReceived: number;
  totalDue: number;
}