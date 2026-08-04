"use client";
import CreateProductModal from "@/components/domain/products/CreateProductModal";
import DeleteProductModal from "@/components/domain/products/DeleteProductModal";
import UpdateProductModal from "@/components/domain/products/UpdateProductModal";
import {
  AsyncState,
  Button,
  CategoryFilter,
  Input,
  StatusBadge,
  Table,
  TableActions,
} from "@/components/ui";
import appConfig from "@/config/app.config";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useSearchProductsQuery } from "@/lib/api/productApi";
import { useDebouncedValue } from "@/lib/useDebounce";
import { formatCurrency } from "@/lib/format";
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
  const debouncedSearch = useDebouncedValue(search);
  const { data: categoriesResponse } = useGetCategoriesQuery(
    1,
    appConfig.maxFetchLimit,
  );
  const categoriesData = categoriesResponse?.data.categories;
  const {
    data: response,
    isLoading,
    isError,
  } = useSearchProductsQuery(
    debouncedSearch,
    selectedCategory === "All" ? null : selectedCategory,
    page,
    limit,
  );

  const products: Product[] = response?.data?.products || [];
  const totalPages = response?.data?.pagination.totalPages || 1;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const openUpdateModal = (product: Product) => {
    setSelectedProductToUpdate(product);
    setIsUpdateProductModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setSelectedProductToDelete(id);
    setIsDeleteProductModalOpen(true);
  };

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
      cell: ({ getValue }) => formatCurrency(Number(getValue())),
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
        <div className="flex items-center justify-end gap-3">
          <Button onClick={() => setIsCreateProductModalOpen(true)}>
            Create New Product
          </Button>
        </div>
        <Input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search products..."
          fullWidth
          leftIcon="Search"
        />

        <CategoryFilter
          categories={categoriesData}
          selected={selectedCategory}
          onSelect={handleCategoryChange}
        />

        <AsyncState
          isLoading={isLoading}
          isError={isError}
          errorMessage="Failed to load products. Please try again."
        >
          <Table
            data={products}
            columns={columns}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </AsyncState>
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
