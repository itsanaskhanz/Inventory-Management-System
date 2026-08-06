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
  customerId?: string;
  cashReceived?: number;
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

export interface OrderStatsResponse {
  message: string;
  success: boolean;
  data: {
    totalRevenue: number;
    totalProfit: number;
    totalOrders: number;
    totalDues: number;
    rangeRevenue: number;
    rangeOrders: number;
    dailyRevenue: { date: string; revenue: number; orders: number }[];
  };
}

export const useGetOrderStatsQuery = (from?: string, to?: string) => {
  return useQuery({
    queryKey: ["orders", "stats", from ?? "", to ?? ""],
    queryFn: async (): Promise<OrderStatsResponse> => {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const query = params.toString();
      const response = await apiClient.get(
        `/orders/stats${query ? `?${query}` : ""}`,
      );
      return response.data;
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
    summary?: {
      totalOrders: number;
      totalAmount: number;
      totalCashReceived: number;
      totalDue: number;
    };
  };
}

export interface CreateOrderResponse {
  message: string;
  success: boolean;
  data: {
    order: Order;
  };
}
