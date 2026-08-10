export interface PaymentHistoryItem {
  id: string;
  customerId: string;
  cashReceived: number;
  note: string | null;
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
