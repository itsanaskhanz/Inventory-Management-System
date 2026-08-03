"use client";
import { Button, Icon, Spinner, Table } from "@/components/ui";
import CreateContractorModal from "@/components/domain/contractors/CreateContractorModal";
import DeleteContractorModal from "@/components/domain/contractors/DeleteContractorModal";
import { UserRole } from "@/config/roles";
import { useGetUsersByRole } from "@/lib/api/authApi";
import { User } from "@/types/auth.types";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

const Page = () => {
  // States
  const limit = 10;
  const [page, setPage] = useState(1);
  // Modals
  const [isCreateContractorModalOpen, setIsCreateContractorModalOpen] =
    useState(false);
  const [isDeleteContractorModelOpen, setIsDeleteContractorModelOpen] =
    useState(false);
  const [selectedContractorToDelete, setSelectedContractorToDelete] = useState<
    string | null
  >(null);
  // API Hooks
  const {
    data: response,
    isLoading,
    isError,
  } = useGetUsersByRole(UserRole.ADMIN, page, limit);
  // Variables
  const users = response?.data?.users || [];
  const totalPages = response?.data?.pagination.totalPages || 1;
  // Columns
  const columns: ColumnDef<User>[] = [
    {
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
    {
      header: "Actions",
      accessorKey: "actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex items-center gap-2">
            <button
              className="cursor-pointer"
              onClick={() => (
                setIsDeleteContractorModelOpen(true),
                setSelectedContractorToDelete(id)
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
          <Button onClick={() => setIsCreateContractorModalOpen(true)}>
            Create New Contractor
          </Button>
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
      <DeleteContractorModal
        isOpen={isDeleteContractorModelOpen}
        contractorId={selectedContractorToDelete}
        onClose={() => setIsDeleteContractorModelOpen(false)}
      />
      <CreateContractorModal
        isOpen={isCreateContractorModalOpen}
        onClose={() => setIsCreateContractorModalOpen(false)}
      />
    </>
  );
};

export default Page;