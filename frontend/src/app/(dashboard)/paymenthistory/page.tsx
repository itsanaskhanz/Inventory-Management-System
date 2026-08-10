"use client";
import { AsyncState, Input, PageHeader, Table } from "@/components/ui";
import appConfig from "@/config/app.config";
import { useSearchCustomersQuery } from "@/lib/api/customerApi";
import { formatDate } from "@/lib/format";
import { useDebouncedValue } from "@/lib/useDebounce";
import { Customer } from "@/types/customer.types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = appConfig.defaultPageLimit;
  const debouncedSearch = useDebouncedValue(search);

  const {
    data: response,
    isLoading,
    isError,
  } = useSearchCustomersQuery(debouncedSearch, page, limit);
  const customers: Customer[] = response?.data?.customers || [];
  const totalPages = response?.data?.pagination.totalPages || 1;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const columns: ColumnDef<Customer>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <Link
            href={`/paymenthistory/${id}`}
            className="font-medium underline"
          >
            {id}
          </Link>
        );
      },
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ getValue }) => (getValue() as string) || "—",
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: ({ getValue }) => (getValue() as string) || "—",
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ getValue }) => formatDate(getValue() as Date),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Customers"
          description="Track your customers and their order history"
        />

        <Input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search customers..."
          fullWidth
          leftIcon="Search"
        />

        <AsyncState
          isLoading={isLoading}
          isError={isError}
          errorMessage="Failed to load customers. Please try again."
        >
          <Table
            data={customers}
            columns={columns}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </AsyncState>
      </div>
    </>
  );
};

export default Page;
