"use client";
import EditOrderModal from "@/components/domain/orders/EditOrderModal";
import { Icon, Input, Spinner, StatusBadge, Table } from "@/components/ui";
import appConfig from "@/config/app.config";
import { useSearchOrdersQuery } from "@/lib/api/orderApi";
import { useDebouncedValue } from "@/lib/useDebounce";
import { Order } from "@/types/order.types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [selectedOrderToUpdate, setSelectedOrderToUpdate] =
    useState<Order | null>(null);
  const limit = appConfig.defaultPageLimit;
  const debouncedSearch = useDebouncedValue(search);
  const {
    data: response,
    isLoading,
    isError,
  } = useSearchOrdersQuery(debouncedSearch, page, limit);

  const orders: Order[] = response?.data?.orders || [];
  const totalPages = response?.data?.pagination.totalPages || 1;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleOpenEditModal = (order: Order) => {
    setSelectedOrderToUpdate(order);
    setIsEditOrderModalOpen(true);
  };

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
      cell: ({ getValue }) => new Date(getValue() as Date).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-6">
          <button
            className="cursor-pointer"
            onClick={() => handleOpenEditModal(row.original)}
          >
            <Icon name="Pencil" size="sm" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-6">
        <Input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by order id..."
          fullWidth
          leftIcon="Search"
        />

        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="rounded-lg border border-border bg-background p-8 text-center text-foreground-secondary">
            Failed to load orders. Please try again.
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

export default Page;
