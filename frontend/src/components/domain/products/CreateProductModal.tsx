"use client";
import { Input, Modal } from "@/components/ui";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useCreateProductMutation } from "@/lib/api/productApi";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProductModal = ({ isOpen, onClose }: CreateProductModalProps) => {
  const queryClient = useQueryClient();
  const { mutate: createProduct } = useCreateProductMutation();
  const { data: categoriesData } = useGetCategoriesQuery(1, 100);
  const categories = categoriesData?.data?.categories || [];
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const resetForm = () => {
    setName("");
    setPrice("");
    setCostPrice("");
    setStock("");
    setMinStock("");
    setCategoryId("");
  };

  const handleCreateProduct = () => {
    if (!name || !price || !costPrice || !stock || !minStock) {
      toast.warn("Please fill in all fields");
      return;
    }
    createProduct(
      {
        name,
        price: Number(price),
        costPrice: Number(costPrice),
        stock: Number(stock),
        minStock: Number(minStock),
        categoryId: categoryId || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Product created successfully");
          onClose();
          resetForm();
          queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to create product",
            );
          } else {
            toast.error("Failed to create product");
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
      onConfirm={handleCreateProduct}
      title="Create New Product"
      description="Enter product details"
      confirmText="Create"
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

export default CreateProductModal;