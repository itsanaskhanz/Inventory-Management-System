"use client";
import { Modal } from "@/components/ui";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useUpdateProductMutation } from "@/lib/api/productApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { Product } from "@/types/product.types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import appConfig from "@/config/app.config";
import ProductFormFields, {
  ProductFormValues,
} from "./ProductFormFields";

const UpdateProductForm = ({
  product,
  isOpen,
  onClose,
}: UpdateProductModalInnerProps) => {
  const queryClient = useQueryClient();
  const { mutate: updateProduct } = useUpdateProductMutation();
  const { data: categoriesData } = useGetCategoriesQuery(
    1,
    appConfig.maxFetchLimit,
  );
  const categories = categoriesData?.data?.categories || [];
  const [values, setValues] = useState<ProductFormValues>(() => ({
    name: product.name,
    description: product.description ?? "",
    price: String(product.price),
    costPrice: String(product.costPrice),
    stock: String(product.stock),
    minStock: String(product.minStock),
    categoryId: product.categoryId || "",
    isActive: product.isActive,
  }));

  const handleUpdateProduct = () => {
    if (
      !values.name ||
      !values.price ||
      !values.costPrice ||
      !values.stock ||
      !values.minStock
    ) {
      toast.warn("Please fill in all fields");
      return;
    }
    updateProduct(
      {
        id: product.id,
        data: {
          name: values.name,
          description: values.description || undefined,
          price: Number(values.price),
          costPrice: Number(values.costPrice),
          stock: Number(values.stock),
          minStock: Number(values.minStock),
          isActive: values.isActive,
          categoryId: values.categoryId || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Product updated successfully");
          onClose();
          queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Failed to update product")),
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleUpdateProduct}
      title="Update Product"
      description="Edit product details"
      confirmText="Update"
      cancelText="Cancel"
    >
      <ProductFormFields
        values={values}
        onChange={setValues}
        categories={categories}
      />
    </Modal>
  );
};

interface UpdateProductModalInnerProps {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
}

interface UpdateProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}

const UpdateProductModal = ({
  isOpen,
  product,
  onClose,
}: UpdateProductModalProps) => {
  if (!product) return null;
  return (
    <UpdateProductForm
      key={product.id}
      isOpen={isOpen}
      product={product}
      onClose={onClose}
    />
  );
};

export default UpdateProductModal;
