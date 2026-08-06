"use client";
import { ConfirmDialog } from "@/components/ui";
import { useDeleteProductMutation } from "@/lib/api/productApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface DeleteProductModalProps {
  isOpen: boolean;
  productId: string | null;
  onClose: () => void;
}

const DeleteProductModal = ({
  isOpen,
  productId,
  onClose,
}: DeleteProductModalProps) => {
  const queryClient = useQueryClient();
  const { mutate } = useDeleteProductMutation(productId || "");

  const handleDeleteProduct = () => {
    if (!productId) return;
    mutate(undefined, {
      onSuccess: () => {
        toast.success("Product deleted successfully");
        onClose();
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
      onError: (error) =>
        toast.error(getApiErrorMessage(error, "Failed to delete product")),
    });
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteProduct}
      title="Delete Product"
      description="Are you sure you want to delete this product?"
      confirmText="Delete"
      pendingText="Deleting..."
      danger
    />
  );
};

export default DeleteProductModal;
