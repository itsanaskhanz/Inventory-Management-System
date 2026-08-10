export interface PaymentHistoryItem {
  id: string;
  cashReceived: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentCustomer {
  id: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentData {
  id: string;
  totalAmount: number;
  cashReceived: number;
  dues: number;
  customer: PaymentCustomer;
  paymentHistory: PaymentHistoryItem[];
}
