"use client";
import { ConfirmDialog } from "@/components/ui";
import { useDeleteCategoryMutation } from "@/lib/api/categoryApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { useQueryClient } from "@tanstack/react-query";
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
      onError: (error) =>
        toast.error(getApiErrorMessage(error, "Failed to delete category")),
    });
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteCategory}
      title="Delete?"
      description="Are you sure want to delete category"
      confirmText="Delete"
      isPending={isPending}
    />
  );
};

export default DeleteCategoryModal;
