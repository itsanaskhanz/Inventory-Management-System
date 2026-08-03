export interface Category {
  id: string;
  name: string;
  userId: string;
  products?: Array<{ id: string }>;
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
