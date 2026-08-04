import { CategoriesResponse, CategoryResponse } from "@/types/category.types";
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

export const useSearchCategoriesQuery = (
  search: string,
  page: number,
  limit: number,
) => {
  return useQuery({
    queryKey: ["categories", "search", search, page, limit],
    queryFn: async (): Promise<CategoriesResponse> => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search.trim()) params.set("search", search.trim());
      const response = await apiClient.get(`/categories/search?${params}`);
      return response.data;
    },
  });
};

export const useGetCategoryByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async (): Promise<CategoryResponse> => {
      const response = await apiClient.get(`/categories/${id}`);
      return response.data;
    },
    enabled: !!id,
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
