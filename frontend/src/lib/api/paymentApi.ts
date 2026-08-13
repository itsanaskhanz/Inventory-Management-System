import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PaymentHistoryItem } from "@/types/payment.types";
import { apiClient } from "../apiClient";

export interface PaymentsResponse {
  message: string;
  success: boolean;
  data: {
    payments: PaymentHistoryItem[];
    pagination: {
      total: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export const useGetPayments = (
  customerId: string,
  page: number,
  limit: number,
) => {
  return useQuery({
    queryKey: ["payments", customerId, page, limit],
    queryFn: async (): Promise<PaymentsResponse> => {
      const response = await apiClient.get<PaymentsResponse>(
        `/payments/${customerId}?page=${page}&limit=${limit}`,
      );
      return response.data;
    },
    enabled: !!customerId,
  });
};

export const useCreatePaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      customerId,
      cashReceived,
      note,
    }: {
      customerId: string;
      cashReceived: number;
      note?: string;
    }) => {
      const response = await apiClient.post(`/payments/${customerId}`, {
        cashReceived,
        note,
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["payments", variables.customerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["customers", variables.customerId, "payment-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["customers", variables.customerId, "orders"],
      });
    },
  });
};

export const useCancelPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      paymentId,
    }: {
      paymentId: string;
      customerId: string;
    }) => {
      const response = await apiClient.post("/payments/cancel", { paymentId });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["payments", variables.customerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["customers", variables.customerId, "payment-summary"],
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({
        queryKey: ["customers", variables.customerId, "orders"],
      });
    },
  });
};
