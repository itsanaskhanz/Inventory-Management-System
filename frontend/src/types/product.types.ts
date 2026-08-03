export type Status = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "DISCONTINUED";

export interface Category {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  userId?: string | null;
  isActive: boolean;
  status: Status;
  category?: Category | null;
  categoryId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pagination {
  total: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductsResponse {
  message: string;
  success: boolean;
  data: {
    products: Product[];
    pagination: Pagination;
  };
}

export interface ProductResponse {
  message: string;
  success: boolean;
  data: {
    product: Product;
  };
}
