"use client";
import { Spinner, Table } from "@/components/ui";
import { UserRole } from "@/config/roles";
import AppLayout from "@/layouts/AppLayout";
import { useGetUsersByRole } from "@/lib/api/authApi";
import { User } from "@/types/auth.types";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

const PAGE_SIZES = [5, 10, 25, 50];

const Page = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const { data: response, isLoading, isError } = useGetUsersByRole(
    UserRole.ADMIN,
    page,
    limit,
  );

  const users = response?.data?.users || [];
  const totalPages = response?.data?.pagination.totalPages || 1;

  const columns: ColumnDef<User>[] = [
    {
      // count number
      header: "#",
      accessorKey: "count",
      enableSorting: false,
      enableHiding: false,
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
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Role",
      accessorKey: "role",
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return new Date(date).toLocaleDateString();
      },
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return new Date(date).toLocaleDateString();
      },
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
            Failed to load contractors. Please try again.
          </div>
        ) : (
          <Table
            data={users}
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
