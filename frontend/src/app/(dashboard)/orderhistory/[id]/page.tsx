"use client";
import { Button, Spinner, StatusBadge, Table, Typography } from "@/components/ui";
import { useGetOrderByIdQuery } from "@/lib/api/orderApi";
import {
  ReceiptData,
  buildReceiptHtml,
  downloadReceipt,
  printReceipt,
} from "@/lib/receipt";
import { IOrderProduct, Order } from "@/types/order.types";
import { ColumnDef } from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";
import appConfig from "@/config/app.config";

const getReceiptData = (order: Order): ReceiptData => ({
  orderNumber: order.orderNumber,
  orderId: order.id,
  createdAt: order.createdAt,
  customerName: order.customerName,
  customerPhone: order.customerPhone,
  items: order.products.map((p) => ({
    name: p.product?.name || p.productId,
    quantity: p.quantity,
    price: p.price,
    subtotal: p.subtotal,
  })),
  subtotal: order.subtotal,
  tax: order.tax,
  total: order.total,
});

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
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!order}
              onClick={() => {
                if (!order) return;
                const receipt = getReceiptData(order);
                printReceipt(buildReceiptHtml(receipt));
              }}
            >
              Print Receipt
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!order}
              onClick={() => {
                if (!order) return;
                downloadReceipt(getReceiptData(order));
              }}
            >
              Download Receipt
            </Button>
            <Button variant="secondary" size="sm" onClick={() => router.back()}>
              Back
            </Button>
          </div>
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