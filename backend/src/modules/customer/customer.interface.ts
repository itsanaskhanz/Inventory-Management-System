export interface ICustomer {
  id: string;
  name?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCustomer {
  name?: string;
  phone?: string;
}

export interface IUpdateCustomer {
  id: string;
  name?: string;
  phone?: string;
}
