"use client";
import { Modal } from "@/components/ui";
import { useDeleteProductMutation } from "@/lib/api/productApi";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to delete product",
          );
        } else {
          toast.error("Failed to delete product");
        }
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleDeleteProduct}
      title="Delete?"
      description="Are you sure want to delete product"
      confirmText="Delete"
      cancelText="Cancel"
    ></Modal>
  );
};

export default DeleteProductModal;