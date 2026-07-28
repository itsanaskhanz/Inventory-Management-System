import { Status } from "../../generated/prisma/enums.js";

export interface IProduct {
  id?: string;
  name: string;
  description?: string | null;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  userId?: string | null;
  isActive: boolean;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateProduct {
  name: string;
  description?: string;
  price: number;
  costPrice: number;
  stock?: number;
  minStock?: number;
  userId?: string;
  isActive?: boolean;
  status?: Status;
  categoryId?: string;
}
