"use client";
import { Modal } from "@/components/ui";
import { UserRole } from "@/config/roles";
import { useDeleteUserMutation } from "@/lib/api/authApi";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to delete contractor",
          );
        } else {
          toast.error("Failed to delete contractor");
        }
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleDeleteContractor}
      title="Delete?"
      description="Are you sure want to delete contractor"
      confirmText="Delete"
      cancelText="Cancel"
    ></Modal>
  );
};

export default DeleteContractorModal;