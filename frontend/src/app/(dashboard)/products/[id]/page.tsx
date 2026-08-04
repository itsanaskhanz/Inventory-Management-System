"use client";
import {
  AsyncState,
  Button,
  DetailField,
  PageHeader,
  StatusBadge,
} from "@/components/ui";
import { useGetProductByIdQuery } from "@/lib/api/productApi";
import { useParams, useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/format";

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading, isError } = useGetProductByIdQuery(id);

  const product = response?.data?.product;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Product Details"
        actions={
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            Back
          </Button>
        }
      />

      <AsyncState
        isLoading={isLoading}
        isError={isError || !product}
        errorMessage="Failed to load product. Please try again."
      >
        {product && (
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
            <DetailField label="Product ID" value={product.id} />
            <DetailField label="Name" value={product.name} />
            <DetailField
              label="Description"
              value={product.description || "—"}
            />
            <DetailField
              label="Price"
              value={formatCurrency(product.price)}
            />
            <DetailField
              label="Cost Price"
              value={formatCurrency(product.costPrice)}
            />
            <DetailField label="Stock" value={product.stock} />
            <DetailField label="Min Stock" value={product.minStock} />
            <DetailField
              label="Active"
              value={product.isActive ? "Yes" : "No"}
            />
            <DetailField label="Status">
              <div className="pt-1">
                <StatusBadge status={product.status} />
              </div>
            </DetailField>
            <DetailField label="Category" value={product.category?.name || "—"} />
            <DetailField
              label="Created At"
              value={new Date(product.createdAt).toLocaleString()}
            />
            <DetailField
              label="Updated At"
              value={new Date(product.updatedAt).toLocaleString()}
            />
          </div>
        )}
      </AsyncState>
    </div>
  );
};

export default ProductDetailPage;
