"use client";
import CreateCategoryModal from "@/components/domain/categories/CreateCategoryModal";
import DeleteCategoryModal from "@/components/domain/categories/DeleteCategoryModal";
import UpdateCategoryModal from "@/components/domain/categories/UpdateCategoryModal";
import {
  AsyncState,
  Button,
  Input,
  Table,
  TableActions,
} from "@/components/ui";
import appConfig from "@/config/app.config";
import { useSearchCategoriesQuery } from "@/lib/api/categoryApi";
import { useDebouncedValue } from "@/lib/useDebounce";
import { Category } from "@/types/category.types";
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
  } = useSearchCategoriesQuery(debouncedSearch, page, limit);
  const totalPages = response?.data?.pagination.totalPages || 1;

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

  const categories: Category[] = response?.data?.categories || [];
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const openUpdateModal = (category: Category) => {
    setSelectedCategoryToUpdate(category);
    setIsUpdateCategoryModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setSelectedCategoryToDelete(id);
    setIsDeleteCategoryModalOpen(true);
  };

  const columns: ColumnDef<Category>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <Link href={`/categories/${id}`} className="font-medium underline">
            {id}
          </Link>
        );
      },
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
        <div className="flex items-center justify-end">
          <Button onClick={() => setIsCreateCategoryModalOpen(true)}>
            Create New Category
          </Button>
        </div>

        <Input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search categories..."
          fullWidth
          leftIcon="Search"
        />

        <AsyncState
          isLoading={isLoading}
          isError={isError}
          errorMessage="Failed to load categories. Please try again."
        >
          <Table
            data={categories}
            columns={columns}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </AsyncState>
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
    </>
  );
};

export default Page;
