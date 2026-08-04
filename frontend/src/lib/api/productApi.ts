import { ProductsResponse, ProductResponse } from "@/types/product.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  isActive?: boolean;
  categoryId?: string;
}

export const useCreateProductMutation = () => {
  return useMutation({
    mutationFn: async (data: CreateProductRequest): Promise<void> => {
      await apiClient.post("/products", data);
    },
  });
};

export const useGetProductsQuery = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["products", page, limit],
    queryFn: async (): Promise<ProductsResponse> => {
      const response = await apiClient.get(
        `/products?page=${page}&limit=${limit}`,
      );
      return response.data;
    },
  });
};

export const useSearchProductsQuery = (
  search: string,
  categoryId: string | null,
  page: number,
  limit: number,
  isActive?: boolean,
) => {
  return useQuery({
    queryKey: ["products", "search", search, categoryId, page, limit, isActive],
    queryFn: async (): Promise<ProductsResponse> => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search.trim()) params.set("search", search.trim());
      if (categoryId) params.set("categoryId", categoryId);
      if (isActive !== undefined) params.set("isActive", String(isActive));
      const response = await apiClient.get(`/products/search?${params}`);
      return response.data;
    },
  });
};

export const useGetProductByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async (): Promise<ProductResponse> => {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useUpdateProductMutation = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CreateProductRequest;
    }): Promise<void> => {
      await apiClient.put(`/products/${id}`, data);
    },
  });
};

export const useDeleteProductMutation = (id: string) => {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.delete(`/products/${id}`);
    },
  });
};
