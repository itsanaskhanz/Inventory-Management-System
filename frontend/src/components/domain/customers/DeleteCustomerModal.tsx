"use client";
import { Modal } from "@/components/ui";
import { useDeleteCustomerMutation } from "@/lib/api/customerApi";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

interface DeleteCustomerModalProps {
  isOpen: boolean;
  customerId: string | null;
  onClose: () => void;
}

const DeleteCustomerModal = ({
  isOpen,
  customerId,
  onClose,
}: DeleteCustomerModalProps) => {
  const queryClient = useQueryClient();
  const { mutate: deleteCustomer, isPending } = useDeleteCustomerMutation();

  const handleDeleteCustomer = () => {
    if (!customerId) return;
    deleteCustomer(customerId, {
      onSuccess: () => {
        toast.success("Customer deleted successfully");
        onClose();
        queryClient.invalidateQueries({ queryKey: ["customers"] });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to delete customer",
          );
        } else {
          toast.error("Failed to delete customer");
        }
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleDeleteCustomer}
      title="Delete?"
      description="Are you sure you want to delete this customer"
      confirmText={isPending ? "Deleting..." : "Delete"}
      cancelText="Cancel"
    ></Modal>
  );
};

export default DeleteCustomerModal;
