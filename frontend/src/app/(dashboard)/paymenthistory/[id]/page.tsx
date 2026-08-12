"use client";
import {
  AsyncState,
  Button,
  ConfirmDialog,
  DetailField,
  Icon,
  Input,
  Modal,
  PageHeader,
  StatusBadge,
  Table,
  Typography,
} from "@/components/ui";
import appConfig from "@/config/app.config";
import {
  useGetCustomerByIdQuery,
  useGetCustomerPaymentSummaryQuery,
} from "@/lib/api/customerApi";
import {
  useCancelPaymentMutation,
  useCreatePaymentMutation,
  useGetPayments,
} from "@/lib/api/paymentApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { formatCurrency, formatDate } from "@/lib/format";
import { PaymentHistoryItem } from "@/types/payment.types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const CustomerDetailPage = () => {
  const router = useRouter();
  const [cashReceived, setCashReceived] = useState("");
  const [note, setNote] = useState("");
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { id } = useParams<{ id: string }>();
  const limit = appConfig.defaultPageLimit;
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
  const {
    data: paymentsResponse,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
  } = useGetPayments(id, page, limit);
  const { mutate: createPayment, isPending: isCreatingPayment } =
    useCreatePaymentMutation();
  const { mutate: cancelPayment, isPending: isCancellingPayment } =
    useCancelPaymentMutation();

  const [paymentToUndo, setPaymentToUndo] = useState<PaymentHistoryItem | null>(
    null,
  );

  const customer = response?.data?.customer;
  const summary = summaryResponse?.data?.summary;
  const payments: PaymentHistoryItem[] = paymentsResponse?.data?.payments || [];
  const totalPages = paymentsResponse?.data?.pagination.totalPages || 1;

  const handleConfirm = () => {
    const amount = Number(cashReceived);
    if (!Number.isFinite(amount) || amount <= 0) return;
    createPayment(
      { customerId: id, cashReceived: amount, note: note || undefined },
      {
        onSuccess: () => {
          toast.success("Payment added successfully");
          setIsAddPaymentOpen(false);
          setCashReceived("");
          setNote("");
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Failed to add payment")),
      },
    );
  };

  const handleUndoConfirm = () => {
    if (!paymentToUndo) return;
    cancelPayment(
      { paymentId: paymentToUndo.id, customerId: id },
      {
        onSuccess: () => {
          toast.success("Payment undone successfully");
          setPaymentToUndo(null);
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Failed to undo payment")),
      },
    );
  };

  const columns: ColumnDef<PaymentHistoryItem>[] = [
    {
      header: "Payment #",
      accessorKey: "id",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
    },
    {
      header: "Amount",
      accessorKey: "cashReceived",
      cell: ({ getValue }) => formatCurrency(Number(getValue())),
    },
    {
      header: "Note",
      accessorKey: "note",
      cell: ({ getValue }) => (getValue() as string) || "—",
    },
    {
      header: "status",
      accessorKey: "status",
      cell: (row) => {
        const status = row.getValue() as string;
        return <StatusBadge status={status} />;
      },
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ getValue }) => formatDate(getValue() as string),
    },
    {
      header: "Action",
      accessorKey: "status",
      cell: (row) => {
        const payment = row.row.original;
        if (payment.status !== "COMPLETED") return null;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPaymentToUndo(payment)}
          >
            <Icon name="X" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Payment Details"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => router.back()}>
              Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddPaymentOpen(true)}
            >
              Add Payment
            </Button>
          </>
        }
      />

      <AsyncState
        isLoading={isCustomerLoading || isSummaryLoading || isPaymentsLoading}
        isError={isError || isSummaryError || isPaymentsError || !customer}
        errorMessage="Failed to load customer. Please try again."
      >
        {customer && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 rounded-xl border border-border bg-background-secondary p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
              <DetailField
                label="Customer ID"
                value={
                  <Link
                    href={`/customers/${customer.id}`}
                    className="font-medium underline"
                  >
                    {customer.id}
                  </Link>
                }
              />
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

            <div className="flex flex-col gap-4">
              <Typography variant="h6" weight="bold" className="mb-2">
                Payment History
              </Typography>
              {payments.length === 0 ? (
                <div className="text-center text-foreground-secondary py-8">
                  No payments recorded for this customer.
                </div>
              ) : (
                <Table
                  data={payments}
                  columns={columns}
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                />
              )}
            </div>
          </div>
        )}
      </AsyncState>
      <Modal
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        title="Add Payment"
        description="Enter Amount"
        onConfirm={handleConfirm}
        onCancel={() => setIsAddPaymentOpen(false)}
        confirmText="Add Payment"
      >
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Enter Amount"
            fullWidth
            type="number"
            min={0}
            step={1}
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
          />
          <Input
            placeholder="Note (optional)"
            fullWidth
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        {isCreatingPayment && (
          <div className="mt-4 text-sm text-foreground-secondary">
            Adding payment…
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!paymentToUndo}
        title="Undo Payment"
        description={`This will reverse payment of ${formatCurrency(paymentToUndo?.cashReceived ?? 0)} and set it to Cancelled. This action cannot be undone.`}
        confirmText="Undo Payment"
        pendingText="Undoing…"
        danger
        isPending={isCancellingPayment}
        onConfirm={handleUndoConfirm}
        onClose={() => setPaymentToUndo(null)}
      />
    </div>
  );
};

export default CustomerDetailPage;
