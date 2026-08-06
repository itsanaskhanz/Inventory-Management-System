import type { Status } from "../../generated/prisma/enums.js";

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
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
  categoryId?: string | null;
}

export type IUpdateProduct = Partial<Omit<ICreateProduct, "userId">>;