export interface Category {
  id: string;
  name: string;
  userId: string;
  productsCount?: number;
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

export interface CategoriesResponse {
  message: string;
  success: boolean;
  data: {
    categories: Category[];
    pagination: Pagination;
  };
}

export interface CategoryResponse {
  message: string;
  success: boolean;
  data: {
    category: Category;
  };
}
