import { CreateOrder, Order } from "@/types/order.types";
import { Pagination } from "@/types/product.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: async (data: CreateOrder): Promise<CreateOrderResponse> => {
      const response = await apiClient.post("/orders", data);
      return response.data;
    },
  });
};

export interface UpdateOrderRequest {
  status?: string;
  customerName?: string;
  customerPhone?: string;
}

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrderRequest;
    }): Promise<CreateOrderResponse> => {
      const response = await apiClient.put(`/orders/${id}`, data);
      return response.data;
    },
  });
};

export const useGetOrdersQuery = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["orders", page, limit],
    queryFn: async (): Promise<OrdersResponse> => {
      const response = await apiClient.get(
        `/orders?page=${page}&limit=${limit}`,
      );
      return response.data;
    },
  });
};

export const useSearchOrdersQuery = (
  search: string,
  page: number,
  limit: number,
) => {
  return useQuery({
    queryKey: ["orders", "search", search, page, limit],
    queryFn: async (): Promise<OrdersResponse> => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search.trim()) params.set("search", search.trim());
      const response = await apiClient.get(`/orders/search?${params}`);
      return response.data;
    },
  });
};

export const useGetAllOrdersQuery = (limit: number) => {
  return useQuery({
    queryKey: ["orders", "all", limit],
    queryFn: async (): Promise<Order[]> => {
      const firstPage = await apiClient.get<OrdersResponse>(
        `/orders?page=1&limit=${limit}`,
      );
      const { orders, pagination } = firstPage.data.data;
      if (pagination.totalPages <= 1) return orders;

      const remaining = await Promise.all(
        Array.from({ length: pagination.totalPages - 1 }, (_, i) =>
          apiClient
            .get<OrdersResponse>(`/orders?page=${i + 2}&limit=${limit}`)
            .then((res) => res.data.data.orders),
        ),
      );

      return [...orders, ...remaining.flat()];
    },
  });
};

export const useGetOrderByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async (): Promise<Order> => {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data.data.order;
    },
    enabled: !!id,
  });
};

export interface OrdersResponse {
  message: string;
  success: boolean;
  data: {
    orders: Order[];
    pagination: Pagination;
  };
}

export interface CreateOrderResponse {
  message: string;
  success: boolean;
  data: {
    order: Order;
  };
}
