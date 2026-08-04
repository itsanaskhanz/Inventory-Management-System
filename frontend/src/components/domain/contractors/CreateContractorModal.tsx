"use client";
import { Input, Modal } from "@/components/ui";
import { UserRole } from "@/config/roles";
import { useRegisterMutation } from "@/lib/api/authApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

interface CreateContractorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateContractorModal = ({
  isOpen,
  onClose,
}: CreateContractorModalProps) => {
  const queryClient = useQueryClient();
  const { mutate: createContractor } = useRegisterMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleCreateContractor = () => {
    if (!name || !email || !password) {
      toast.warn("Please fill in all fields");
      return;
    }
    createContractor(
      { name, email, password },
      {
        onSuccess: () => {
          toast.success("Contractor created successfully");
          onClose();
          resetForm();
          queryClient.invalidateQueries({
            queryKey: [`users-${UserRole.ADMIN}`],
          });
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Failed to create contractor")),
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleCreateContractor}
      title="Create New Contractor"
      description="Enter contractor details"
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
        <Input
          placeholder="Email"
          fullWidth
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default CreateContractorModal;