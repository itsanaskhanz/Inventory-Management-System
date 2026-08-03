"use client";
import { Modal } from "@/components/ui";
import { useDeleteCategoryMutation } from "@/lib/api/categoryApi";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  categoryId: string | null;
  onClose: () => void;
}

const DeleteCategoryModal = ({
  isOpen,
  categoryId,
  onClose,
}: DeleteCategoryModalProps) => {
  const queryClient = useQueryClient();
  const { mutate: deleteCategory, isPending } = useDeleteCategoryMutation();

  const handleDeleteCategory = () => {
    if (!categoryId) return;
    deleteCategory(categoryId, {
      onSuccess: () => {
        toast.success("Category deleted successfully");
        onClose();
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to delete category",
          );
        } else {
          toast.error("Failed to delete category");
        }
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleDeleteCategory}
      title="Delete?"
      description="Are you sure want to delete category"
      confirmText={isPending ? "Deleting..." : "Delete"}
      cancelText="Cancel"
    ></Modal>
  );
};

export default DeleteCategoryModal;