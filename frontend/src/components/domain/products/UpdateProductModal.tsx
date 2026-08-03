"use client";
import { Input, Modal } from "@/components/ui";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useUpdateProductMutation } from "@/lib/api/productApi";
import { Product } from "@/types/product.types";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const UpdateProductForm = ({
  product,
  isOpen,
  onClose,
}: UpdateProductModalInnerProps) => {
  const queryClient = useQueryClient();
  const { mutate: updateProduct } = useUpdateProductMutation();
  const { data: categoriesData } = useGetCategoriesQuery(1, 100);
  const categories = categoriesData?.data?.categories || [];
  const [name, setName] = useState(product ? product.name : "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [costPrice, setCostPrice] = useState(
    product ? String(product.costPrice) : "",
  );
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [minStock, setMinStock] = useState(
    product ? String(product.minStock) : "",
  );
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");

  const handleUpdateProduct = () => {
    if (!product) return;
    if (!name || !price || !costPrice || !stock || !minStock) {
      toast.warn("Please fill in all fields");
      return;
    }
    updateProduct(
      {
        id: product.id,
        data: {
          name,
          price: Number(price),
          costPrice: Number(costPrice),
          stock: Number(stock),
          minStock: Number(minStock),
          categoryId: categoryId || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Product updated successfully");
          onClose();
          queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to update product",
            );
          } else {
            toast.error("Failed to update product");
          }
        },
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
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-md border border-border bg-background-secondary px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
        >
          <option value="">Select Category (optional)</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Price"
          fullWidth
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input
          placeholder="Cost Price"
          fullWidth
          type="number"
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
        />
        <Input
          placeholder="Stock"
          fullWidth
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <Input
          placeholder="Min Stock"
          fullWidth
          type="number"
          value={minStock}
          onChange={(e) => setMinStock(e.target.value)}
        />
      </div>
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