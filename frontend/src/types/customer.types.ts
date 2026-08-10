export interface Customer {
  id: string;
  name?: string | null;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pagination {
  total: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CustomersResponse {
  message: string;
  success: boolean;
  data: {
    customers: Customer[];
    pagination: Pagination;
  };
}

export interface CustomerResponse {
  message: string;
  success: boolean;
  data: {
    customer: Customer;
  };
}

export interface CustomerPaymentSummary {
  totalOrders: number;
  totalAmount: number;
  totalCashReceived: number;
  totalDue: number;
}

export interface CustomerPaymentSummaryResponse {
  message: string;
  success: boolean;
  data: {
    summary: CustomerPaymentSummary;
  };
}
