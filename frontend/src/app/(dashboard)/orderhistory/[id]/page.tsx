"use client";
import { Button, Spinner, StatusBadge, Table, Typography } from "@/components/ui";
import { useGetOrderByIdQuery } from "@/lib/api/orderApi";
import { IOrderProduct } from "@/types/order.types";
import { ColumnDef } from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";
import appConfig from "@/config/app.config";

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError } = useGetOrderByIdQuery(id);

  const columns: ColumnDef<IOrderProduct>[] = [
    {
      header: "Product",
      accessorKey: "product",
      cell: ({ row }) => row.original.product?.name || row.original.productId,
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: ({ getValue }) =>
        `${appConfig.appCurrencySymbol}${Number(getValue()).toFixed(2)}`,
    },
    {
      header: "Subtotal",
      accessorKey: "subtotal",
      cell: ({ getValue }) =>
        `${appConfig.appCurrencySymbol}${Number(getValue()).toFixed(2)}`,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Typography variant="h5" weight="bold">
            Order Details
          </Typography>
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            Back
          </Button>
        </div>

        {isLoading ? (
          <Spinner />
        ) : isError || !order ? (
          <div className="rounded-lg border border-border bg-background p-8 text-center text-foreground-secondary">
            Failed to load order. Please try again.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
              <div>
                <Typography variant="body2" color="secondary">
                  Order Number
                </Typography>
                <Typography variant="body1" weight="medium">
                  {order.orderNumber}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" color="secondary">
                  Status
                </Typography>
                <div className="pt-1">
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <div>
                <Typography variant="body2" color="secondary">
                  Date
                </Typography>
                <Typography variant="body1" weight="medium">
                  {new Date(order.createdAt).toLocaleString()}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" color="secondary">
                  Order ID
                </Typography>
                <Typography variant="body1" weight="medium">
                  {order.id}
                </Typography>
              </div>
              {order.customerName && (
                <div>
                  <Typography variant="body2" color="secondary">
                    Customer Name
                  </Typography>
                  <Typography variant="body1" weight="medium">
                    {order.customerName}
                  </Typography>
                </div>
              )}
              {order.customerPhone && (
                <div>
                  <Typography variant="body2" color="secondary">
                    Customer Phone
                  </Typography>
                  <Typography variant="body1" weight="medium">
                    {order.customerPhone}
                  </Typography>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border p-4">
              <Typography variant="h6" weight="bold" className="mb-3">
                Items
              </Typography>
              <Table
                data={order.products}
                columns={columns}
                page={1}
                setPage={() => undefined}
                totalPages={1}
              />
            </div>

            <div className="flex flex-col gap-1 text-sm rounded-lg border border-border p-4">
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Subtotal</span>
                <span>
                  {appConfig.appCurrencySymbol}
                  {order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Tax</span>
                <span>
                  {appConfig.appCurrencySymbol}
                  {order.tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>
                  {appConfig.appCurrencySymbol}
                  {order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default OrderDetailPage;