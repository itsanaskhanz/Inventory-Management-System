"use client";
import CancelOrderModal from "@/components/domain/orders/CancelOrderModal";
import { AsyncState, PageHeader, SearchBar, StatusBadge, Table, TableActions } from "@/components/ui";
import appConfig from "@/config/app.config";
import { useSearchOrdersQuery } from "@/lib/api/orderApi";
import { formatCurrency, formatDate } from "@/lib/format";
import { Order } from "@/types/order.types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState<Order | null>(null);
  const limit = appConfig.defaultPageLimit;
  const { data: response, isLoading, isError } = useSearchOrdersQuery(submittedSearch, page, limit);
  const orders: Order[] = response?.data?.orders || [];
  const totalPages = response?.data?.pagination.totalPages || 1;

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    setSubmittedSearch(search.trim());
    setPage(1);
  };

  const handleOpenCancelModal = (order: Order) => {
    setSelectedOrderToCancel(order);
    setIsCancelOrderModalOpen(true);
  };

  const columns: ColumnDef<Order>[] = [
    {
      header: "Order #",
      accessorKey: "id",
    },
    {
      header: "Items",
      accessorKey: "products",
      cell: ({ getValue }) => (getValue() as Order["products"]).length,
    },
    // customer name with phone number
    {
      header: "Customer Name",
      accessorKey: "customer",
      cell: ({ row }) => {
        return row.original.customer?.name || "-";
      },
    },
    {
      header: "Phone",
      accessorKey: "phoneNumber",
      cell: ({ row }) => {
        return row.original.customer?.phone || "-";
      },
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: ({ getValue }) => formatCurrency(Number(getValue())),
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
            onView={() => router.push(`/orderhistory/${row.original.id}`)}
            onCancel={() => handleOpenCancelModal(row.original)}
          />
        ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-6">
        <PageHeader title="Order History" description="View and manage all orders placed in your store" />
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          onSearch={handleSearchSubmit}
          placeholder="Search by order id..."
        />

        <AsyncState isLoading={isLoading} isError={isError} errorMessage="Failed to load orders. Please try again.">
          <Table data={orders} columns={columns} page={page} setPage={setPage} totalPages={totalPages} />
        </AsyncState>
      </div>
      <CancelOrderModal
        isOpen={isCancelOrderModalOpen}
        order={selectedOrderToCancel}
        onClose={() => {
          setIsCancelOrderModalOpen(false);
          setSelectedOrderToCancel(null);
        }}
      />
    </div>
  );
};

export default Page;
