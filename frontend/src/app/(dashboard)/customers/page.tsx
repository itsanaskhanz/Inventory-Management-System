"use client";
import CreateCustomerModal from "@/components/domain/customers/CreateCustomerModal";
import DeleteCustomerModal from "@/components/domain/customers/DeleteCustomerModal";
import UpdateCustomerModal from "@/components/domain/customers/UpdateCustomerModal";
import {
  AsyncState,
  Button,
  Input,
  PageHeader,
  Table,
  TableActions,
} from "@/components/ui";
import appConfig from "@/config/app.config";
import { useSearchCustomersQuery } from "@/lib/api/customerApi";
import { useDebouncedValue } from "@/lib/useDebounce";
import { formatDate } from "@/lib/format";
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

  const openUpdateModal = (customer: Customer) => {
    setSelectedCustomerToUpdate(customer);
    setIsUpdateCustomerModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setSelectedCustomerToDelete(id);
    setIsDeleteCustomerModalOpen(true);
  };

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
      cell: ({ getValue }) => formatDate(getValue() as Date),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <TableActions
          onEdit={() => openUpdateModal(row.original)}
          onDelete={() => openDeleteModal(row.original.id)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Customers"
          description="Track your customers and their order history"
          actions={
            <Button onClick={() => setIsCreateCustomerModalOpen(true)}>
              New Customer
            </Button>
          }
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
