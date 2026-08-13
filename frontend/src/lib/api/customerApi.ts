import {
  CustomerPaymentSummaryResponse,
  CustomersResponse,
  CustomerResponse,
} from "@/types/customer.types";
import { OrdersResponse } from "./orderApi";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export interface CreateCustomerRequest {
  name?: string;
  phone?: string;
}

export const useCreateCustomerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCustomerRequest): Promise<void> => {
      await apiClient.post("/customers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useSearchCustomersQuery = (
  search: string,
  page: number,
  limit: number,
) => {
  return useQuery({
    queryKey: ["customers", "search", search, page, limit],
    queryFn: async (): Promise<CustomersResponse> => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search.trim()) params.set("search", search.trim());
      const response = await apiClient.get(`/customers/search?${params}`);
      return response.data;
    },
  });
};

export const useGetCustomerOrdersQuery = (
  customerId: string,
  search: string,
  page: number,
  limit: number,
) => {
  return useQuery({
    queryKey: ["customers", customerId, "orders", search, page, limit],
    queryFn: async (): Promise<OrdersResponse> => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search.trim()) params.set("search", search.trim());
      const response = await apiClient.get(
        `/customers/${customerId}/orders?${params}`,
      );
      return response.data;
    },
    enabled: !!customerId,
  });
};

export const useGetCustomerPaymentSummaryQuery = (customerId: string) => {
  return useQuery({
    queryKey: ["customers", customerId, "payment-summary"],
    queryFn: async (): Promise<CustomerPaymentSummaryResponse> => {
      const response = await apiClient.get(
        `/customers/${customerId}/payment-summary`,
      );
      return response.data;
    },
    enabled: !!customerId,
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
  const queryClient = useQueryClient();
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });
};

export const useDeleteCustomerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });
};
