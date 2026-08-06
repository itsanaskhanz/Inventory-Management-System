"use client";
import { AsyncState, Button, PageHeader, Table, TableActions } from "@/components/ui";
import CreateContractorModal from "@/components/domain/contractors/CreateContractorModal";
import DeleteContractorModal from "@/components/domain/contractors/DeleteContractorModal";
import { UserRole } from "@/config/roles";
import { useGetUsersByRole } from "@/lib/api/authApi";
import { formatDate } from "@/lib/format";
import { User } from "@/types/auth.types";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import appConfig from "@/config/app.config";

const Page = () => {
  const limit = appConfig.defaultPageLimit;
  const [page, setPage] = useState(1);

  const [isCreateContractorModalOpen, setIsCreateContractorModalOpen] =
    useState(false);
  const [isDeleteContractorModelOpen, setIsDeleteContractorModelOpen] =
    useState(false);
  const [selectedContractorToDelete, setSelectedContractorToDelete] = useState<
    string | null
  >(null);

  const {
    data: response,
    isLoading,
    isError,
  } = useGetUsersByRole(UserRole.ADMIN, page, limit);

  const users = response?.data?.users || [];
  const totalPages = response?.data?.pagination.totalPages || 1;

  const openDeleteModal = (id: string) => {
    setSelectedContractorToDelete(id);
    setIsDeleteContractorModelOpen(true);
  };

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
      cell: ({ getValue }) => formatDate(getValue() as string),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: ({ getValue }) => formatDate(getValue() as string),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <TableActions onDelete={() => openDeleteModal(row.original.id)} />
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Contractors"
          description="Manage administrative accounts across your workspace"
          actions={
            <Button onClick={() => setIsCreateContractorModalOpen(true)}>
              New Contractor
            </Button>
          }
        />

        <AsyncState
          isLoading={isLoading}
          isError={isError}
          errorMessage="Failed to load contractors. Please try again."
        >
          <Table
            data={users}
            columns={columns}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </AsyncState>
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
