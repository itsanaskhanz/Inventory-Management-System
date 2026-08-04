"use client";
import { Modal } from "@/components/ui";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useCreateProductMutation } from "@/lib/api/productApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import appConfig from "@/config/app.config";
import ProductFormFields, {
  EMPTY_PRODUCT_FORM,
  ProductFormValues,
} from "./ProductFormFields";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProductModal = ({ isOpen, onClose }: CreateProductModalProps) => {
  const queryClient = useQueryClient();
  const { mutate: createProduct } = useCreateProductMutation();
  const { data: categoriesData } = useGetCategoriesQuery(
    1,
    appConfig.maxFetchLimit,
  );
  const categories = categoriesData?.data?.categories || [];
  const [values, setValues] =
    useState<ProductFormValues>(EMPTY_PRODUCT_FORM);

  const resetForm = () => setValues(EMPTY_PRODUCT_FORM);

  const handleCreateProduct = () => {
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
    createProduct(
      {
        name: values.name,
        description: values.description || undefined,
        price: Number(values.price),
        costPrice: Number(values.costPrice),
        stock: Number(values.stock),
        minStock: Number(values.minStock),
        isActive: values.isActive,
        categoryId: values.categoryId || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Product created successfully");
          onClose();
          resetForm();
          queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Failed to create product")),
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleCreateProduct}
      title="Create New Product"
      description="Enter product details"
      confirmText="Create"
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

export default CreateProductModal;
