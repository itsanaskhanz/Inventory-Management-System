"use client";
import { ConfirmDialog } from "@/components/ui";
import { useDeleteCustomerMutation } from "@/lib/api/customerApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { useQueryClient } from "@tanstack/react-query";
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
      onError: (error) =>
        toast.error(getApiErrorMessage(error, "Failed to delete customer")),
    });
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteCustomer}
      title="Delete Customer"
      description="Are you sure you want to delete this customer?"
      confirmText="Delete"
      pendingText="Deleting..."
      isPending={isPending}
      danger
    />
  );
};

export default DeleteCustomerModal;
