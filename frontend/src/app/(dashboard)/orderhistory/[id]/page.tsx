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
import { useGetOrderByIdQuery } from "@/lib/api/orderApi";
import {
  ReceiptData,
  buildReceiptHtml,
  downloadReceipt,
  printReceipt,
} from "@/lib/receipt";
import { formatCurrency } from "@/lib/format";
import { IOrderProduct, Order } from "@/types/order.types";
import { ColumnDef } from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";

const getReceiptData = (order: Order): ReceiptData => ({
  orderId: order.id,
  createdAt: order.createdAt,
  customerName: order.customer?.name ?? null,
  customerPhone: order.customer?.phone ?? null,
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
      cell: ({ getValue }) => formatCurrency(Number(getValue())),
    },
    {
      header: "Subtotal",
      accessorKey: "subtotal",
      cell: ({ getValue }) => formatCurrency(Number(getValue())),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Order Details"
        actions={
          <>
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
          </>
        }
      />

      <AsyncState
        isLoading={isLoading}
        isError={isError || !order}
        errorMessage="Failed to load order. Please try again."
      >
        {order && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
              <DetailField label="Order ID" value={order.id} />
              <DetailField label="Status">
                <div className="pt-1">
                  <StatusBadge status={order.status} />
                </div>
              </DetailField>
              <DetailField
                label="Date"
                value={new Date(order.createdAt).toLocaleString()}
              />
              {order.customer?.name && (
                <DetailField label="Customer Name" value={order.customer.name} />
              )}
              {order.customer?.phone && (
                <DetailField
                  label="Customer Phone"
                  value={order.customer.phone}
                />
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
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        )}
      </AsyncState>
    </div>
  );
};

export default OrderDetailPage;
