"use client";
import { AsyncState, Button, DetailField, PageHeader } from "@/components/ui";
import {
  useGetCustomerByIdQuery,
  useGetCustomerPaymentSummaryQuery,
} from "@/lib/api/customerApi";
import { formatCurrency } from "@/lib/format";
import { useParams, useRouter } from "next/navigation";

const CustomerDetailPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const {
    data: response,
    isLoading: isCustomerLoading,
    isError,
  } = useGetCustomerByIdQuery(id);
  const {
    data: summaryResponse,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useGetCustomerPaymentSummaryQuery(id);

  const customer = response?.data?.customer;
  const summary = summaryResponse?.data?.summary;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Payment Details"
        actions={
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            Back
          </Button>
        }
      />

      <AsyncState
        isLoading={isCustomerLoading || isSummaryLoading}
        isError={isError || isSummaryError || !customer}
        errorMessage="Failed to load customer. Please try again."
      >
        {customer && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 rounded-xl border border-border bg-background-secondary p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
              <DetailField label="Customer ID" value={customer.id} />
              <DetailField label="Name" value={customer.name || "—"} />
              <DetailField label="Phone" value={customer.phone || "—"} />
              <DetailField
                label="Total Amount"
                value={summary?.totalAmount ?? formatCurrency(0)}
              />
              <DetailField
                label="Total Orders"
                value={summary?.totalOrders ?? 0}
              />
              <DetailField
                label="Cash Received"
                value={formatCurrency(summary?.totalCashReceived ?? 0)}
              />
              <DetailField
                label="Total Due"
                value={formatCurrency(summary?.totalDue ?? 0)}
              />
            </div>
          </div>
        )}
      </AsyncState>
    </div>
  );
};

export default CustomerDetailPage;
