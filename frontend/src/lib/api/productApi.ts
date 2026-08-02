import { ProductsResponse } from "@/types/product.types";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

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
