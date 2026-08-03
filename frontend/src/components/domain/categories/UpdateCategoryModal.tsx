"use client";
import { Input, Modal } from "@/components/ui";
import { useUpdateCategoryMutation } from "@/lib/api/categoryApi";
import { Category } from "@/types/category.types";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const UpdateCategoryForm = ({
  category,
  isOpen,
  onClose,
}: UpdateCategoryModalInnerProps) => {
  const queryClient = useQueryClient();
  const { mutate: updateCategory, isPending } = useUpdateCategoryMutation();
  const [name, setName] = useState(category.name);

  const handleUpdateCategory = () => {
    if (!name) {
      toast.warn("Please fill in the name");
      return;
    }
    updateCategory(
      { id: category.id, name },
      {
        onSuccess: () => {
          toast.success("Category updated successfully");
          onClose();
          queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to update category",
            );
          } else {
            toast.error("Failed to update category");
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
      onConfirm={handleUpdateCategory}
      title="Update Category"
      description="Edit category details"
      confirmText={isPending ? "Updating..." : "Update"}
      cancelText="Cancel"
    >
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </Modal>
  );
};

interface UpdateCategoryModalInnerProps {
  isOpen: boolean;
  category: Category;
  onClose: () => void;
}

interface UpdateCategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
}

const UpdateCategoryModal = ({
  isOpen,
  category,
  onClose,
}: UpdateCategoryModalProps) => {
  if (!category) return null;
  return (
    <UpdateCategoryForm
      key={category.id}
      isOpen={isOpen}
      category={category}
      onClose={onClose}
    />
  );
};

export default UpdateCategoryModal;