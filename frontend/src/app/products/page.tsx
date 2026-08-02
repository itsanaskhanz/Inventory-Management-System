"use client";
import { Spinner, Table } from "@/components/ui";
import AppLayout from "@/layouts/AppLayout";
import { useGetProductsQuery } from "@/lib/api/productApi";
import { Product } from "@/types/product.types";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

const PAGE_SIZES = [5, 10, 25, 50];

const Page = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const { data: response, isLoading, isError } = useGetProductsQuery(page, limit);

  const products: Product[] = response?.data?.products || [];
  const totalPages = response?.data?.pagination.totalPages || 1;

  const columns: ColumnDef<Product>[] = [
    {
      header: "#",
      accessorKey: "index",
      enableSorting: false,
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
    },
    {
      header: "Cost Price",
      accessorKey: "costPrice",
      cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
    },
    {
      header: "Stock",
      accessorKey: "stock",
    },
    {
      header: "Min Stock",
      accessorKey: "minStock",
    },
    {
      header: "Active",
      accessorKey: "isActive",
      cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: ({ row }) => row.original.category?.name || "—",
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ getValue }) => (getValue() as string) || "—",
    },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="page-size" className="text-sm text-foreground-secondary">
              Rows per page
            </label>
            <select
              id="page-size"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-md border border-border bg-background-secondary px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="rounded-lg border border-border bg-background p-8 text-center text-foreground-secondary">
            Failed to load products. Please try again.
          </div>
        ) : (
          <Table
            data={products}
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
