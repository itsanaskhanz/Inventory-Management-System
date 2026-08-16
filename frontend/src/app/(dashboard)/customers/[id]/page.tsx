"use client";
import CancelOrderModal from "@/components/domain/orders/CancelOrderModal";
import AddPaymentModal from "@/components/domain/payments/AddPaymentModal";
import {
  AsyncState,
  Button,
  ConfirmDialog,
  DetailField,
  EmptyState,
  Icon,
  PageHeader,
  SearchBar,
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
import { useCancelPaymentMutation, useGetPayments } from "@/lib/api/paymentApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { formatCurrency, formatDate } from "@/lib/format";
import { IOrderProduct, Order } from "@/types/order.types";
import { PaymentHistoryItem } from "@/types/payment.types";
import { ColumnDef } from "@tanstack/react-table";
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
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState<Order | null>(null);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentSearch, setPaymentSearch] = useState("");
  const [submittedPaymentSearch, setSubmittedPaymentSearch] = useState("");
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [paymentToUndo, setPaymentToUndo] = useState<PaymentHistoryItem | null>(null);
  const limit = appConfig.defaultPageLimit;
  const { data: response, isLoading: isCustomerLoading, isError } = useGetCustomerByIdQuery(id);
  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useGetCustomerOrdersQuery(id, submittedSearch, page, limit);
  const {
    data: summaryResponse,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useGetCustomerPaymentSummaryQuery(id);
  const {
    data: paymentsResponse,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
  } = useGetPayments(id, submittedPaymentSearch, paymentsPage, limit);
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
  };

  const handleSearchSubmit = () => {
    setSubmittedSearch(search.trim());
    setPage(1);
  };

  const handlePaymentSearchChange = (value: string) => {
    setPaymentSearch(value);
  };

  const handlePaymentSearchSubmit = () => {
    setSubmittedPaymentSearch(paymentSearch.trim());
    setPaymentsPage(1);
  };

  const handleOpenCancelModal = (order: Order) => {
    setSelectedOrderToCancel(order);
    setIsCancelOrderModalOpen(true);
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
      cell: ({ getValue }) => getValue(),
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
          <TableActions
            onCancel={() => handleOpenCancelModal(row.original)}
            onView={() => router.push(`/orderhistory/${row.original.id}`)}
          />
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
                <SearchBar
                  value={search}
                  onChange={handleSearchChange}
                  onSearch={handleSearchSubmit}
                  placeholder="Search by order id..."
                />
                {orders.length === 0 ? (
                  <EmptyState icon="ShoppingBag" title="No orders found for this customer." className="py-10" />
                ) : (
                  <Table data={orders} columns={orderColumns} page={page} setPage={setPage} totalPages={totalPages} />
                )}
              </div>
            )}

            {activeTab === "payments" && (
              <div className="flex flex-col gap-4">
                <SearchBar
                  value={paymentSearch}
                  onChange={handlePaymentSearchChange}
                  onSearch={handlePaymentSearchSubmit}
                  placeholder="Search by payment id..."
                />
                <AsyncState
                  isLoading={isPaymentsLoading}
                  isError={isPaymentsError}
                  errorMessage="Failed to load payments. Please try again."
                >
                  {payments.length === 0 ? (
                    <EmptyState
                      icon="CircleDollarSign"
                      title="No payments recorded for this customer."
                      className="py-10"
                    />
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

      <AddPaymentModal
        isOpen={isAddPaymentOpen}
        customer={customer ?? null}
        onClose={() => setIsAddPaymentOpen(false)}
      />

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
