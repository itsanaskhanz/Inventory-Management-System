"use client";
import CreateProductModal from "@/components/domain/products/CreateProductModal";
import DeleteProductModal from "@/components/domain/products/DeleteProductModal";
import UpdateProductModal from "@/components/domain/products/UpdateProductModal";
import {
  Button,
  CategoryFilter,
  Icon,
  Input,
  Spinner,
  StatusBadge,
  Table,
} from "@/components/ui";
import appConfig from "@/config/app.config";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useGetProductsQuery } from "@/lib/api/productApi";
import { Product } from "@/types/product.types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
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
  const limit = appConfig.defaultPageLimit;
  const [page, setPage] = useState(1);
  const { data: categoriesResponse } = useGetCategoriesQuery(
    1,
    appConfig.maxFetchLimit,
  );
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
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <Link href={`/products/${id}`} className="font-medium underline">
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
      header: "Price",
      accessorKey: "price",
      cell: ({ getValue }) =>
        `${appConfig.appCurrencySymbol}${Number(getValue()).toFixed(2)}`,
    },
    {
      header: "Stock",
      accessorKey: "stock",
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
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-end gap-3">
          <Button onClick={() => setIsCreateProductModalOpen(true)}>
            Create New Product
          </Button>
        </div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          fullWidth
          leftIcon="Search"
        />

        <CategoryFilter
          categories={categoriesData}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

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
    </>
  );
};

export default Page;
