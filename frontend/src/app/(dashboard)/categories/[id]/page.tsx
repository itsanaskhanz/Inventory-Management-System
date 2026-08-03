"use client";
import { Button, Spinner, Typography } from "@/components/ui";
import { useGetCategoryByIdQuery } from "@/lib/api/categoryApi";
import { useParams, useRouter } from "next/navigation";

const CategoryDetailPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading, isError } = useGetCategoryByIdQuery(id);

  const category = response?.data?.category;

  return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Typography variant="h5" weight="bold">
            Category Details
          </Typography>
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            Back
          </Button>
        </div>

        {isLoading ? (
          <Spinner />
        ) : isError || !category ? (
          <div className="rounded-lg border border-border bg-background p-8 text-center text-foreground-secondary">
            Failed to load category. Please try again.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
            <div>
              <Typography variant="body2" color="secondary">
                Category ID
              </Typography>
              <Typography variant="body1" weight="medium">
                {category.id}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Name
              </Typography>
              <Typography variant="body1" weight="medium">
                {category.name}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Products
              </Typography>
              <Typography variant="body1" weight="medium">
                {category.products?.length ?? 0}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Created At
              </Typography>
              <Typography variant="body1" weight="medium">
                {new Date(category.createdAt).toLocaleString()}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="secondary">
                Updated At
              </Typography>
              <Typography variant="body1" weight="medium">
                {new Date(category.updatedAt).toLocaleString()}
              </Typography>
            </div>
          </div>
        )}
      </div>
  );
};

export default CategoryDetailPage;