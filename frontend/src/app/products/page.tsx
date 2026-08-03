"use client";
import CreateProductModal from "@/components/domain/products/CreateProductModal";
import DeleteProductModal from "@/components/domain/products/DeleteProductModal";
import UpdateProductModal from "@/components/domain/products/UpdateProductModal";
import { Button, CategoryFilter, Icon, Input, Spinner, StatusBadge, Table } from "@/components/ui";
import AppLayout from "@/layouts/AppLayout";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useGetProductsQuery } from "@/lib/api/productApi";
import { Product } from "@/types/product.types";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

const Page = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] =
    useState(false);
  const [isUpdateProductModalOpen, setIsUpdateProductModalOpen] =
    useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
    useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] = useState<
    string | null
  >(null);
  const [selectedProductToUpdate, setSelectedProductToUpdate] =
    useState<Product | null>(null);
  const limit = 10;
  const [page, setPage] = useState(1);
  const { data: categoriesResponse } = useGetCategoriesQuery(1, 100);
  const categoriesData = categoriesResponse?.data.categories;
  const {
    data: response,
    isLoading,
    isError,
  } = useGetProductsQuery(page, limit);

  const products: Product[] = response?.data?.products || [];
  const totalPages = response?.data?.pagination.totalPages || 1;

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase().trim());
    const matchesCategory =
      selectedCategory === "All" ||
      product.categoryId === selectedCategory ||
      product.category?.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
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
                setSelectedProductToUpdate(row.original),
                setIsUpdateProductModalOpen(true)
              )}
            >
              <Icon name="Pencil" size="sm" />
            </button>
            <button
              className="cursor-pointer"
              onClick={() => (
                setIsDeleteProductModalOpen(true),
                setSelectedProductToDelete(id)
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
          <Button onClick={() => setIsCreateProductModalOpen(true)}>
            Create New Product
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            fullWidth
          />
          <CategoryFilter
            categories={categoriesData}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="rounded-lg border border-border bg-background p-8 text-center text-foreground-secondary">
            Failed to load products. Please try again.
          </div>
        ) : (
          <Table
            data={filteredProducts}
            columns={columns}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        )}
      </div>
      <DeleteProductModal
        isOpen={isDeleteProductModalOpen}
        productId={selectedProductToDelete}
        onClose={() => setIsDeleteProductModalOpen(false)}
      />
      <UpdateProductModal
        isOpen={isUpdateProductModalOpen}
        product={selectedProductToUpdate}
        onClose={() => {
          setIsUpdateProductModalOpen(false);
          setSelectedProductToUpdate(null);
        }}
      />
      <CreateProductModal
        isOpen={isCreateProductModalOpen}
        onClose={() => setIsCreateProductModalOpen(false)}
      />
    </AppLayout>
  );
};

export default Page;
