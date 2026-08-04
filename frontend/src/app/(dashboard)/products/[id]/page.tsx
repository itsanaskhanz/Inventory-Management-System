"use client";
import { Button, Spinner, StatusBadge, Typography } from "@/components/ui";
import { useGetProductByIdQuery } from "@/lib/api/productApi";
import { useParams, useRouter } from "next/navigation";
import appConfig from "@/config/app.config";

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading, isError } = useGetProductByIdQuery(id);

  const product = response?.data?.product;

  return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Typography variant="h5" weight="bold">
            Product Details
          </Typography>
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            Back
          </Button>
        </div>

        {isLoading ? (
          <Spinner />
        ) : isError || !product ? (
          <div className="rounded-lg border border-border bg-background p-8 text-center text-foreground-secondary">
            Failed to load product. Please try again.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
            <div>
              <Typography variant="body2" color="secondary">
                Product ID
              </Typography>
              <Typography variant="body1" weight="medium">
                {product.id}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Name
              </Typography>
              <Typography variant="body1" weight="medium">
                {product.name}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Description
              </Typography>
              <Typography variant="body1" weight="medium">
                {product.description || "—"}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Price
              </Typography>
              <Typography variant="body1" weight="medium">
                {appConfig.appCurrencySymbol}
                {Number(product.price).toFixed(2)}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Cost Price
              </Typography>
              <Typography variant="body1" weight="medium">
                {appConfig.appCurrencySymbol}
                {Number(product.costPrice).toFixed(2)}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Stock
              </Typography>
              <Typography variant="body1" weight="medium">
                {product.stock}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Min Stock
              </Typography>
              <Typography variant="body1" weight="medium">
                {product.minStock}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Active
              </Typography>
              <Typography variant="body1" weight="medium">
                {product.isActive ? "Yes" : "No"}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Status
              </Typography>
              <div className="pt-1">
                <StatusBadge status={product.status} />
              </div>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Category
              </Typography>
              <Typography variant="body1" weight="medium">
                {product.category?.name || "—"}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Created At
              </Typography>
              <Typography variant="body1" weight="medium">
                {new Date(product.createdAt).toLocaleString()}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Updated At
              </Typography>
              <Typography variant="body1" weight="medium">
                {new Date(product.updatedAt).toLocaleString()}
              </Typography>
            </div>
          </div>
        )}
      </div>
  );
};

export default ProductDetailPage;