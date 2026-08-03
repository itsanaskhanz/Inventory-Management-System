"use client";
import { Button, Icon, Spinner, Table } from "@/components/ui";
import CreateCategoryModal from "@/components/domain/categories/CreateCategoryModal";
import DeleteCategoryModal from "@/components/domain/categories/DeleteCategoryModal";
import UpdateCategoryModal from "@/components/domain/categories/UpdateCategoryModal";
import AppLayout from "@/layouts/AppLayout";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { Category } from "@/types/category.types";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

const Page = () => {
  // States
  const [page, setPage] = useState(1);
  const limit = 10;
  // API Hooks
  const {
    data: response,
    isLoading,
    isError,
  } = useGetCategoriesQuery(page, limit);
  const totalPages = response?.data?.pagination.totalPages || 1;

  // Modals
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);
  const [isUpdateCategoryModalOpen, setIsUpdateCategoryModalOpen] =
    useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] =
    useState(false);
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState<
    string | null
  >(null);
  const [selectedCategoryToUpdate, setSelectedCategoryToUpdate] =
    useState<Category | null>(null);

  // Data to load
  const categories: Category[] = response?.data?.categories || [];
  // Columns
  const columns: ColumnDef<Category>[] = [
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
      header: "Products",
      accessorKey: "products",
      cell: ({ row }) => row.original.products?.length ?? 0,
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
          <div className="flex items-center gap-6">
            <button
              className="cursor-pointer"
              onClick={() => (
                setSelectedCategoryToUpdate(row.original),
                setIsUpdateCategoryModalOpen(true)
              )}
            >
              <Icon name="Pencil" size="sm" />
            </button>
            <button
              className="cursor-pointer"
              onClick={() => (
                setIsDeleteCategoryModalOpen(true),
                setSelectedCategoryToDelete(id)
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
    <AppLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end">
          <Button onClick={() => setIsCreateCategoryModalOpen(true)}>
            Create New Category
          </Button>
        </div>

        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="rounded-lg border border-border bg-background p-8 text-center text-foreground-secondary">
            Failed to load categories. Please try again.
          </div>
        ) : (
          <Table
            data={categories}
            columns={columns}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        )}
      </div>
      <DeleteCategoryModal
        isOpen={isDeleteCategoryModalOpen}
        categoryId={selectedCategoryToDelete}
        onClose={() => setIsDeleteCategoryModalOpen(false)}
      />
      <UpdateCategoryModal
        isOpen={isUpdateCategoryModalOpen}
        category={selectedCategoryToUpdate}
        onClose={() => {
          setIsUpdateCategoryModalOpen(false);
          setSelectedCategoryToUpdate(null);
        }}
      />
      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
      />
    </AppLayout>
  );
};

export default Page;