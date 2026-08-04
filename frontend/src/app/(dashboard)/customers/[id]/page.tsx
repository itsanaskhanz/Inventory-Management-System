"use client";
import { Button, Spinner, StatusBadge, Table, Typography } from "@/components/ui";
import { useGetCustomerByIdQuery } from "@/lib/api/customerApi";
import appConfig from "@/config/app.config";
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
      cell: ({ getValue }) =>
        `${appConfig.appCurrencySymbol}${Number(getValue()).toFixed(2)}`,
    },
    {
      header: "Tax",
      accessorKey: "tax",
      cell: ({ getValue }) =>
        `${appConfig.appCurrencySymbol}${Number(getValue()).toFixed(2)}`,
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: ({ getValue }) =>
        `${appConfig.appCurrencySymbol}${Number(getValue()).toFixed(2)}`,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ getValue }) =>
        new Date(getValue() as Date).toLocaleDateString(),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Typography variant="h5" weight="bold">
          Customer Details
        </Typography>
        <Button variant="secondary" size="sm" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError || !customer ? (
        <div className="rounded-lg border border-border bg-background p-8 text-center text-foreground-secondary">
          Failed to load customer. Please try again.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
            <div>
              <Typography variant="body2" color="secondary">
                Customer ID
              </Typography>
              <Typography variant="body1" weight="medium">
                {customer.id}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Name
              </Typography>
              <Typography variant="body1" weight="medium">
                {customer.name || "—"}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Phone
              </Typography>
              <Typography variant="body1" weight="medium">
                {customer.phone || "—"}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Total Orders
              </Typography>
              <Typography variant="body1" weight="medium">
                {orders.length}
              </Typography>
            </div>
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
    </div>
  );
};

export default CustomerDetailPage;
