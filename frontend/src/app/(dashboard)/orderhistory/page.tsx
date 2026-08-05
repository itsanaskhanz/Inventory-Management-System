"use client";
import EditOrderModal from "@/components/domain/orders/EditOrderModal";
import {
  AsyncState,
  Input,
  StatusBadge,
  Table,
  TableActions,
} from "@/components/ui";
import appConfig from "@/config/app.config";
import { useSearchOrdersQuery } from "@/lib/api/orderApi";
import { useDebouncedValue } from "@/lib/useDebounce";
import { formatCurrency, formatDate } from "@/lib/format";
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
      header: "Items",
      accessorKey: "products",
      cell: ({ getValue }) => (getValue() as Order["products"]).length,
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
    <div>
      <div className="flex flex-col gap-6">
        <Input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by order id..."
          fullWidth
          leftIcon="Search"
        />

        <AsyncState
          isLoading={isLoading}
          isError={isError}
          errorMessage="Failed to load orders. Please try again."
        >
          <Table
            data={orders}
            columns={columns}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </AsyncState>
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
