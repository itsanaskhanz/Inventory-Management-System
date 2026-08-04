"use client";
import {
  AsyncState,
  Button,
  DetailField,
  PageHeader,
  StatusBadge,
  Table,
  Typography,
} from "@/components/ui";
import { useGetCustomerByIdQuery } from "@/lib/api/customerApi";
import { formatCurrency, formatDate } from "@/lib/format";
import { IOrderProduct, Order } from "@/types/order.types";
import { ColumnDef } from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface CustomerOrder extends Order {
  products: IOrderProduct[];
}

const CustomerDetailPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading, isError } = useGetCustomerByIdQuery(id);

  const customer = response?.data?.customer;
  const orders: CustomerOrder[] =
    (customer as unknown as { orders?: CustomerOrder[] })?.orders || [];

  const columns: ColumnDef<CustomerOrder>[] = [
    {
      header: "Order #",
      accessorKey: "orderNumber",
      cell: ({ row }) => (
        <Link
          href={`/orderhistory/${row.original.id}`}
          className="text-primary hover:underline"
        >
          {row.original.orderNumber}
        </Link>
      ),
    },
    {
      header: "Items",
      accessorKey: "products",
      cell: ({ getValue }) => (getValue() as IOrderProduct[]).length,
    },
    {
      header: "Subtotal",
      accessorKey: "subtotal",
      cell: ({ getValue }) => formatCurrency(Number(getValue())),
    },
    {
      header: "Tax",
      accessorKey: "tax",
      cell: ({ getValue }) => formatCurrency(Number(getValue())),
    },
    {
      header: "Total",
      accessorKey: "total",
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
        isLoading={isLoading}
        isError={isError || !customer}
        errorMessage="Failed to load customer. Please try again."
      >
        {customer && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
              <DetailField label="Customer ID" value={customer.id} />
              <DetailField label="Name" value={customer.name || "—"} />
              <DetailField label="Phone" value={customer.phone || "—"} />
              <DetailField label="Total Orders" value={orders.length} />
            </div>

            <div className="rounded-lg border border-border p-4">
              <Typography variant="h6" weight="bold" className="mb-3">
                Order History
              </Typography>
              {orders.length === 0 ? (
                <div className="text-center text-foreground-secondary py-8">
                  No orders found for this customer.
                </div>
              ) : (
                <Table
                  data={orders}
                  columns={columns}
                  page={1}
                  setPage={() => undefined}
                  totalPages={1}
                />
              )}
            </div>
          </div>
        )}
      </AsyncState>
    </div>
  );
};

export default CustomerDetailPage;
