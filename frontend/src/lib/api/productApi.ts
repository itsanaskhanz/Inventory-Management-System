import { ProductsResponse } from "@/types/product.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
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
