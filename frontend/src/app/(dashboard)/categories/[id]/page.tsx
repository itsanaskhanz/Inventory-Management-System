"use client";
import { AsyncState, Button, DetailField, PageHeader } from "@/components/ui";
import { useGetCategoryByIdQuery } from "@/lib/api/categoryApi";
import { useParams, useRouter } from "next/navigation";

const CategoryDetailPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading, isError } = useGetCategoryByIdQuery(id);

  const category = response?.data?.category;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Category Details"
        actions={
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            Back
          </Button>
        }
      />

      <AsyncState
        isLoading={isLoading}
        isError={isError || !category}
        errorMessage="Failed to load category. Please try again."
      >
        {category && (
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
            <DetailField label="Category ID" value={category.id} />
            <DetailField label="Name" value={category.name} />
            <DetailField
              label="Products"
              value={category.productsCount ?? 0}
            />
            <DetailField
              label="Created At"
              value={new Date(category.createdAt).toLocaleString()}
            />
            <DetailField
              label="Updated At"
              value={new Date(category.updatedAt).toLocaleString()}
            />
          </div>
        )}
      </AsyncState>
    </div>
  );
};

export default CategoryDetailPage;
