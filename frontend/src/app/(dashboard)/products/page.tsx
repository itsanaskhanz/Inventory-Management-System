"use client";
import CreateProductModal from "@/components/domain/products/CreateProductModal";
import DeleteProductModal from "@/components/domain/products/DeleteProductModal";
import UpdateProductModal from "@/components/domain/products/UpdateProductModal";
import {
  AsyncState,
  Button,
  CategoryFilter,
  PageHeader,
  SearchBar,
  StatusBadge,
  Table,
  TableActions,
} from "@/components/ui";
import appConfig from "@/config/app.config";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useSearchProductsQuery } from "@/lib/api/productApi";
import { formatCurrency } from "@/lib/format";
import { Product } from "@/types/product.types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
  const [isUpdateProductModalOpen, setIsUpdateProductModalOpen] = useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] = useState<string | null>(null);
  const [selectedProductToUpdate, setSelectedProductToUpdate] = useState<Product | null>(null);
  const limit = appConfig.defaultPageLimit;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const { data: categoriesResponse } = useGetCategoriesQuery(1, appConfig.maxFetchLimit);
  const categoriesData = categoriesResponse?.data.categories;
  const {
    data: response,
    isLoading,
    isError,
  } = useSearchProductsQuery(submittedSearch, selectedCategory === "All" ? null : selectedCategory, page, limit);

  const products: Product[] = response?.data?.products || [];
  const totalPages = response?.data?.pagination.totalPages || 1;

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    setSubmittedSearch(search.trim());
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
          onView={() => router.push(`/products/${row.original.id}`)}
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
          title="Products"
          description="Manage your product catalog and stock levels"
          actions={
            <Button onClick={() => setIsCreateProductModalOpen(true)} size="sm">
              New Product
            </Button>
          }
        />
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          onSearch={handleSearchSubmit}
          placeholder="Search products..."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
          <div className="flex items-center gap-2">
            <CategoryFilter categories={categoriesData} selected={selectedCategory} onSelect={handleCategoryChange} />
          </div>
        </div>

        <AsyncState isLoading={isLoading} isError={isError} errorMessage="Failed to load products. Please try again.">
          <Table data={products} columns={columns} page={page} setPage={setPage} totalPages={totalPages} />
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
      <CreateProductModal isOpen={isCreateProductModalOpen} onClose={() => setIsCreateProductModalOpen(false)} />
    </>
  );
};

export default Page;
