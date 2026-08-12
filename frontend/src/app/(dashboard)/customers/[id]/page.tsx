"use client";
import CancelOrderModal from "@/components/domain/orders/CancelOrderModal";
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
  TableActions,
  Tabs,
} from "@/components/ui";
import appConfig from "@/config/app.config";
import {
  useGetCustomerByIdQuery,
  useGetCustomerOrdersQuery,
  useGetCustomerPaymentSummaryQuery,
} from "@/lib/api/customerApi";
import { useCancelPaymentMutation, useCreatePaymentMutation, useGetPayments } from "@/lib/api/paymentApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { formatCurrency, formatDate } from "@/lib/format";
import { useDebouncedValue } from "@/lib/useDebounce";
import { IOrderProduct, Order } from "@/types/order.types";
import { PaymentHistoryItem } from "@/types/payment.types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface CustomerOrder extends Order {
  products: IOrderProduct[];
}

type DetailTab = "orders" | "payments";

const CustomerDetailPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<DetailTab>("orders");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState<Order | null>(null);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [cashReceived, setCashReceived] = useState("");
  const [note, setNote] = useState("");
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [paymentToUndo, setPaymentToUndo] = useState<PaymentHistoryItem | null>(null);
  const limit = appConfig.defaultPageLimit;
  const debouncedSearch = useDebouncedValue(search);
  const { data: response, isLoading: isCustomerLoading, isError } = useGetCustomerByIdQuery(id);
  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useGetCustomerOrdersQuery(id, debouncedSearch, page, limit);
  const {
    data: summaryResponse,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useGetCustomerPaymentSummaryQuery(id);
  const {
    data: paymentsResponse,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
  } = useGetPayments(id, paymentsPage, limit);
  const { mutate: createPayment, isPending: isCreatingPayment } = useCreatePaymentMutation();
  const { mutate: cancelPayment, isPending: isCancellingPayment } = useCancelPaymentMutation();

  const customer = response?.data?.customer;
  const orders: CustomerOrder[] = ordersResponse?.data?.orders || [];
  const totalOrders = ordersResponse?.data?.pagination.total ?? 0;
  const totalPages = ordersResponse?.data?.pagination.totalPages || 1;
  const summary = summaryResponse?.data?.summary;
  const payments: PaymentHistoryItem[] = paymentsResponse?.data?.payments || [];
  const paymentsTotalPages = paymentsResponse?.data?.pagination.totalPages || 1;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleOpenCancelModal = (order: Order) => {
    setSelectedOrderToCancel(order);
    setIsCancelOrderModalOpen(true);
  };

  const handleAddPaymentConfirm = () => {
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
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to add payment")),
      },
    );
  };

  const handleUndoPaymentConfirm = () => {
    if (!paymentToUndo) return;
    cancelPayment(
      { paymentId: paymentToUndo.id, customerId: id },
      {
        onSuccess: () => {
          toast.success("Payment undone successfully");
          setPaymentToUndo(null);
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to undo payment")),
      },
    );
  };

  const orderColumns: ColumnDef<CustomerOrder>[] = [
    {
      header: "Order #",
      accessorKey: "id",
      cell: ({ row }) => (
        <Link href={`/orderhistory/${row.original.id}`} className="text-primary hover:underline">
          {row.original.id}
        </Link>
      ),
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: ({ getValue }) => formatCurrency(Number(getValue())),
    },
    {
      header: "Items",
      accessorKey: "products",
      cell: ({ getValue }) => (getValue() as IOrderProduct[]).length,
    },
    {
      header: "Cash",
      accessorKey: "cashReceived",
      cell: ({ getValue }) => formatCurrency(Number(getValue())),
    },
    {
      header: "Due",
      accessorKey: "due",
      cell: ({ getValue }) => formatCurrency(Number(getValue())),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ getValue }) => formatDate(getValue() as Date),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) =>
        row.original.status.toUpperCase() === "CANCELLED" ? null : (
          <TableActions onCancel={() => handleOpenCancelModal(row.original)} />
        ),
    },
  ];

  const paymentColumns: ColumnDef<PaymentHistoryItem>[] = [
    {
      header: "Payment #",
      accessorKey: "id",
      cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span>,
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
      header: "Status",
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
          <Button variant="ghost" size="sm" onClick={() => setPaymentToUndo(payment)}>
            <Icon name="X" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Customer Details"
        actions={
          <>
            <Button variant="primary" size="sm" onClick={() => setIsAddPaymentOpen(true)}>
              Add Payment
            </Button>
            <Button variant="secondary" size="sm" onClick={() => router.back()}>
              Back
            </Button>
          </>
        }
      />

      <AsyncState
        isLoading={isCustomerLoading || isOrdersLoading || isSummaryLoading}
        isError={isError || isOrdersError || isSummaryError || !customer}
        errorMessage="Failed to load customer. Please try again."
      >
        {customer && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 rounded-xl border border-border bg-background-secondary p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
              <DetailField label="Customer ID" value={customer.id} />
              <DetailField label="Name" value={customer.name || "—"} />
              <DetailField label="Phone" value={customer.phone || "—"} />
              <DetailField label="Total Amount" value={summary?.totalAmount ?? formatCurrency(0)} />
              <DetailField label="Total Orders" value={summary?.totalOrders ?? totalOrders} />
              <DetailField label="Cash Received" value={formatCurrency(summary?.totalCashReceived ?? 0)} />
              <DetailField label="Total Due" value={formatCurrency(summary?.totalDue ?? 0)} />
            </div>

            <Tabs<DetailTab>
              value={activeTab}
              onValueChange={setActiveTab}
              tabs={[
                { value: "orders", label: "Orders" },
                { value: "payments", label: "Payments" },
              ]}
            />

            {activeTab === "orders" && (
              <div className="flex flex-col gap-6">
                <Input
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by order id..."
                  fullWidth
                  leftIcon="Search"
                />
                {orders.length === 0 ? (
                  <div className="text-center text-foreground-secondary py-8">No orders found for this customer.</div>
                ) : (
                  <Table data={orders} columns={orderColumns} page={page} setPage={setPage} totalPages={totalPages} />
                )}
              </div>
            )}

            {activeTab === "payments" && (
              <div className="flex flex-col gap-4">
                <AsyncState
                  isLoading={isPaymentsLoading}
                  isError={isPaymentsError}
                  errorMessage="Failed to load payments. Please try again."
                >
                  {payments.length === 0 ? (
                    <div className="text-center text-foreground-secondary py-8">
                      No payments recorded for this customer.
                    </div>
                  ) : (
                    <Table
                      data={payments}
                      columns={paymentColumns}
                      page={paymentsPage}
                      setPage={setPaymentsPage}
                      totalPages={paymentsTotalPages}
                    />
                  )}
                </AsyncState>
              </div>
            )}
          </div>
        )}
      </AsyncState>

      <CancelOrderModal
        isOpen={isCancelOrderModalOpen}
        order={selectedOrderToCancel}
        onClose={() => {
          setIsCancelOrderModalOpen(false);
          setSelectedOrderToCancel(null);
        }}
      />

      <Modal
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        title="Add Payment"
        description="Enter Amount"
        onConfirm={handleAddPaymentConfirm}
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
          <Input placeholder="Note (optional)" fullWidth value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        {isCreatingPayment && <div className="mt-4 text-sm text-foreground-secondary">Adding payment…</div>}
      </Modal>

      <ConfirmDialog
        isOpen={!!paymentToUndo}
        title="Undo Payment"
        description={`This will reverse payment of ${formatCurrency(paymentToUndo?.cashReceived ?? 0)} and set it to Cancelled. This action cannot be undone.`}
        confirmText="Undo Payment"
        pendingText="Undoing…"
        danger
        isPending={isCancellingPayment}
        onConfirm={handleUndoPaymentConfirm}
        onClose={() => setPaymentToUndo(null)}
      />
    </div>
  );
};

export default CustomerDetailPage;
