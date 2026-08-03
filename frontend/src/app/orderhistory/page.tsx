"use client";
import { Input, Spinner, StatusBadge, Table } from "@/components/ui";
import AppLayout from "@/layouts/AppLayout";
import { useGetOrdersQuery } from "@/lib/api/orderApi";
import { Order } from "@/types/order.types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;
  const { data: response, isLoading, isError } = useGetOrdersQuery(page, limit);

  const orders: Order[] = response?.data?.orders || [];
  const totalPages = response?.data?.pagination.totalPages || 1;

  const filteredOrders = orders.filter((order) =>
    String(order.orderNumber)
      .toLowerCase()
      .includes(search.toLowerCase().trim()),
  );

  const columns: ColumnDef<Order>[] = [
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
      cell: ({ getValue }) => (getValue() as Order["products"]).length,
    },
    {
      header: "Subtotal",
      accessorKey: "subtotal",
      cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
    },
    {
      header: "Tax",
      accessorKey: "tax",
      cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ getValue }) => new Date(getValue() as Date).toLocaleDateString(),
    },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order id..."
          fullWidth
        />

        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="rounded-lg border border-border bg-background p-8 text-center text-foreground-secondary">
            Failed to load orders. Please try again.
          </div>
        ) : (
          <Table
            data={filteredOrders}
            columns={columns}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default Page;
