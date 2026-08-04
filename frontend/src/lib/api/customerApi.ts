import {
  Customer,
  CustomersResponse,
  CustomerResponse,
} from "@/types/customer.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export interface CreateCustomerRequest {
  name?: string;
  phone?: string;
}

export const useCreateCustomerMutation = () => {
  return useMutation({
    mutationFn: async (data: CreateCustomerRequest): Promise<void> => {
      await apiClient.post("/customers", data);
    },
  });
};

export const useGetCustomersQuery = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["customers", page, limit],
    queryFn: async (): Promise<CustomersResponse> => {
      const response = await apiClient.get(
        `/customers?page=${page}&limit=${limit}`,
      );
      return response.data;
    },
  });
};

export const useGetAllCustomersQuery = (limit: number) => {
  return useQuery({
    queryKey: ["customers", "all", limit],
    queryFn: async (): Promise<Customer[]> => {
      const firstPage = await apiClient.get<CustomersResponse>(
        `/customers?page=1&limit=${limit}`,
      );
      const { customers, pagination } = firstPage.data.data;
      if (pagination.totalPages <= 1) return customers;

      const remaining = await Promise.all(
        Array.from({ length: pagination.totalPages - 1 }, (_, i) =>
          apiClient
            .get<CustomersResponse>(
              `/customers?page=${i + 2}&limit=${limit}`,
            )
            .then((res) => res.data.data.customers),
        ),
      );

      return [...customers, ...remaining.flat()];
    },
  });
};

export const useGetCustomerByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: async (): Promise<CustomerResponse> => {
      const response = await apiClient.get(`/customers/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useUpdateCustomerMutation = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CreateCustomerRequest;
    }): Promise<void> => {
      await apiClient.put(`/customers/${id}`, data);
    },
  });
};

export const useDeleteCustomerMutation = () => {
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/customers/${id}`);
    },
  });
};
