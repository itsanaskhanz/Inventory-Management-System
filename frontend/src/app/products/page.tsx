"use client";
import { Button, Icon, Spinner, Table } from "@/components/ui";
import CreateProductModal from "@/components/domain/products/CreateProductModal";
import DeleteProductModal from "@/components/domain/products/DeleteProductModal";
import UpdateProductModal from "@/components/domain/products/UpdateProductModal";
import AppLayout from "@/layouts/AppLayout";
import { useGetProductsQuery } from "@/lib/api/productApi";
import { Product } from "@/types/product.types";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

const Page = () => {
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
  const {
    data: response,
    isLoading,
    isError,
  } = useGetProductsQuery(page, limit);

  const products: Product[] = response?.data?.products || [];
  const totalPages = response?.data?.pagination.totalPages || 1;

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

        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="rounded-lg border border-border bg-background p-8 text-center text-foreground-secondary">
            Failed to load products. Please try again.
          </div>
        ) : (
          <Table
            data={products}
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