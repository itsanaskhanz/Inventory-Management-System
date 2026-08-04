"use client";
import CreateCustomerModal from "@/components/domain/customers/CreateCustomerModal";
import DeleteCustomerModal from "@/components/domain/customers/DeleteCustomerModal";
import UpdateCustomerModal from "@/components/domain/customers/UpdateCustomerModal";
import { Button, Icon, Input, Spinner, Table } from "@/components/ui";
import appConfig from "@/config/app.config";
import { useGetCustomersQuery } from "@/lib/api/customerApi";
import { useDebouncedValue } from "@/lib/useDebounce";
import { Customer } from "@/types/customer.types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isCreateCustomerModalOpen, setIsCreateCustomerModalOpen] =
    useState(false);
  const [isUpdateCustomerModalOpen, setIsUpdateCustomerModalOpen] =
    useState(false);
  const [isDeleteCustomerModalOpen, setIsDeleteCustomerModalOpen] =
    useState(false);
  const [selectedCustomerToDelete, setSelectedCustomerToDelete] = useState<
    string | null
  >(null);
  const [selectedCustomerToUpdate, setSelectedCustomerToUpdate] =
    useState<Customer | null>(null);
  const limit = appConfig.defaultPageLimit;

  const {
    data: response,
    isLoading,
    isError,
  } = useGetCustomersQuery(page, limit);

  const customers: Customer[] = response?.data?.customers || [];
  const totalPages = response?.data?.pagination.totalPages || 1;

  const filteredCustomers = useDebouncedValue(search)
    ? customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.phone?.includes(search),
      )
    : customers;

  const columns: ColumnDef<Customer>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <Link href={`/customers/${id}`} className="font-medium underline">
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
      cell: ({ getValue }) =>
        new Date(getValue() as Date).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex items-center gap-6">
            <button
              className="cursor-pointer"
              onClick={() => (
                setSelectedCustomerToUpdate(row.original),
                setIsUpdateCustomerModalOpen(true)
              )}
            >
              <Icon name="Pencil" size="sm" />
            </button>
            <button
              className="cursor-pointer"
              onClick={() => (
                setIsDeleteCustomerModalOpen(true),
                setSelectedCustomerToDelete(id)
              )}
            >
              <Icon name="Trash" size="sm" color="red" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-end">
          <Button onClick={() => setIsCreateCustomerModalOpen(true)}>
            Create New Customer
          </Button>
        </div>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          fullWidth
          leftIcon="Search"
        />

        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="rounded-lg border border-border bg-background p-8 text-center text-foreground-secondary">
            Failed to load customers. Please try again.
          </div>
        ) : (
          <Table
            data={filteredCustomers}
            columns={columns}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        )}
      </div>
      <DeleteCustomerModal
        isOpen={isDeleteCustomerModalOpen}
        customerId={selectedCustomerToDelete}
        onClose={() => setIsDeleteCustomerModalOpen(false)}
      />
      <UpdateCustomerModal
        isOpen={isUpdateCustomerModalOpen}
        customer={selectedCustomerToUpdate}
        onClose={() => {
          setIsUpdateCustomerModalOpen(false);
          setSelectedCustomerToUpdate(null);
        }}
      />
      <CreateCustomerModal
        isOpen={isCreateCustomerModalOpen}
        onClose={() => setIsCreateCustomerModalOpen(false)}
      />
    </>
  );
};

export default Page;
