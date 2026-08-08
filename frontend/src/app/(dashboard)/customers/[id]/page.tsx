"use client";
import EditOrderModal from "@/components/domain/orders/EditOrderModal";
import {
  AsyncState,
  Button,
  DetailField,
  Input,
  PageHeader,
  StatusBadge,
  Table,
  TableActions,
  Typography,
} from "@/components/ui";
import appConfig from "@/config/app.config";
import {
  useGetCustomerByIdQuery,
  useGetCustomerOrdersQuery,
} from "@/lib/api/customerApi";
import { formatCurrency, formatDate } from "@/lib/format";
import { useDebouncedValue } from "@/lib/useDebounce";
import { IOrderProduct, Order } from "@/types/order.types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface CustomerOrder extends Order {
  products: IOrderProduct[];
}

const CustomerDetailPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [selectedOrderToUpdate, setSelectedOrderToUpdate] =
    useState<Order | null>(null);
  const limit = appConfig.defaultPageLimit;
  const debouncedSearch = useDebouncedValue(search);
  const {
    data: response,
    isLoading: isCustomerLoading,
    isError,
  } = useGetCustomerByIdQuery(id);
  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useGetCustomerOrdersQuery(id, debouncedSearch, page, limit);

  const customer = response?.data?.customer;
  const orders: CustomerOrder[] = ordersResponse?.data?.orders || [];
  const totalOrders = ordersResponse?.data?.pagination.total ?? 0;
  const totalPages = ordersResponse?.data?.pagination.totalPages || 1;
  const summary = ordersResponse?.data?.summary;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleOpenEditModal = (order: Order) => {
    setSelectedOrderToUpdate(order);
    setIsEditOrderModalOpen(true);
  };

  const columns: ColumnDef<CustomerOrder>[] = [
    {
      header: "Order #",
      accessorKey: "id",
      cell: ({ row }) => (
        <Link
          href={`/orderhistory/${row.original.id}`}
          className="text-primary hover:underline"
        >
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
      cell: ({ row }) => (
        <TableActions onEdit={() => handleOpenEditModal(row.original)} />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Customer Details"
        actions={
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            Back
          </Button>
        }
      />

      <AsyncState
        isLoading={isCustomerLoading || isOrdersLoading}
        isError={isError || isOrdersError || !customer}
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
                value={summary?.totalOrders ?? totalOrders}
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

            <div className="flex flex-col gap-6">
              <Typography variant="h6" weight="bold" className="mb-4">
                Order History
              </Typography>
              <Input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by order id..."
                fullWidth
                leftIcon="Search"
              />
              {orders.length === 0 ? (
                <div className="text-center text-foreground-secondary py-8">
                  No orders found for this customer.
                </div>
              ) : (
                <Table
                  data={orders}
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
      <EditOrderModal
        isOpen={isEditOrderModalOpen}
        order={selectedOrderToUpdate}
        onClose={() => {
          setIsEditOrderModalOpen(false);
          setSelectedOrderToUpdate(null);
        }}
      />
    </div>
  );
};

export default CustomerDetailPage;
