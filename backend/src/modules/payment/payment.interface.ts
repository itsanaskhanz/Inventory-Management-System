export interface ICreatePayment {
  cashReceived: number;
  note?: string;
}

export interface IPayment {
  id: string;
  customerId: string;
  cashReceived: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}
