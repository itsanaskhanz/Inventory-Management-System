import { CategoriesResponse } from "@/types/category.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export const useGetCategoriesQuery = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["categories", page, limit],
    queryFn: async (): Promise<CategoriesResponse> => {
      const response = await apiClient.get(
        `/categories?page=${page}&limit=${limit}`,
      );
      return response.data;
    },
  });
};

export const useCreateCategoryMutation = () => {
  return useMutation({
    mutationFn: async (name: string): Promise<void> => {
      await apiClient.post("/categories", { name });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  return useMutation({
    mutationFn: async ({
      id,
      name,
    }: {
      id: string;
      name: string;
    }): Promise<void> => {
      await apiClient.put(`/categories/${id}`, { name });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/categories/${id}`);
    },
  });
};
