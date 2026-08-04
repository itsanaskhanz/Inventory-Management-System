"use client";
import { ConfirmDialog } from "@/components/ui";
import { UserRole } from "@/config/roles";
import { useDeleteUserMutation } from "@/lib/api/authApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface DeleteContractorModalProps {
  isOpen: boolean;
  contractorId: string | null;
  onClose: () => void;
}

const DeleteContractorModal = ({
  isOpen,
  contractorId,
  onClose,
}: DeleteContractorModalProps) => {
  const queryClient = useQueryClient();
  const { mutate } = useDeleteUserMutation();

  const handleDeleteContractor = () => {
    if (!contractorId) return;
    mutate(contractorId, {
      onSuccess: () => {
        toast.success("Contractor deleted successfully");
        onClose();
        queryClient.invalidateQueries({
          queryKey: [`users-${UserRole.ADMIN}`],
        });
      },
      onError: (error) =>
        toast.error(getApiErrorMessage(error, "Failed to delete contractor")),
    });
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteContractor}
      title="Delete?"
      description="Are you sure want to delete contractor"
      confirmText="Delete"
    />
  );
};

export default DeleteContractorModal;
