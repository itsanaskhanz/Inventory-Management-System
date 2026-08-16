"use client";
import CreateCategoryModal from "@/components/domain/categories/CreateCategoryModal";
import DeleteCategoryModal from "@/components/domain/categories/DeleteCategoryModal";
import UpdateCategoryModal from "@/components/domain/categories/UpdateCategoryModal";
import { AsyncState, Button, PageHeader, SearchBar, Table, TableActions } from "@/components/ui";
import appConfig from "@/config/app.config";
import { useSearchCategoriesQuery } from "@/lib/api/categoryApi";
import { Category } from "@/types/category.types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const limit = appConfig.defaultPageLimit;

  const { data: response, isLoading, isError } = useSearchCategoriesQuery(submittedSearch, page, limit);
  const totalPages = response?.data?.pagination.totalPages || 1;

  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isUpdateCategoryModalOpen, setIsUpdateCategoryModalOpen] = useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState<string | null>(null);
  const [selectedCategoryToUpdate, setSelectedCategoryToUpdate] = useState<Category | null>(null);

  const categories: Category[] = response?.data?.categories || [];
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    setSubmittedSearch(search.trim());
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
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Products",
      accessorKey: "productsCount",
      cell: ({ row }) => row.original.productsCount ?? 0,
    },
    {
      header: "Actions",
      accessorKey: "actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <TableActions
          onView={() => router.push(`/categories/${row.original.id}`)}
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
          title="Categories"
          description="Organize your products into categories"
          actions={
            <Button size="sm" onClick={() => setIsCreateCategoryModalOpen(true)}>
              New Category
            </Button>
          }
        />

        <SearchBar
          value={search}
          onChange={handleSearchChange}
          onSearch={handleSearchSubmit}
          placeholder="Search categories..."
        />

        <AsyncState isLoading={isLoading} isError={isError} errorMessage="Failed to load categories. Please try again.">
          <Table data={categories} columns={columns} page={page} setPage={setPage} totalPages={totalPages} />
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
      <CreateCategoryModal isOpen={isCreateCategoryModalOpen} onClose={() => setIsCreateCategoryModalOpen(false)} />
    </>
  );
};

export default Page;
