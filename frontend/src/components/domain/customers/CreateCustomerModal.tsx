"use client";
import { Input, Modal } from "@/components/ui";
import { useCreateCustomerMutation } from "@/lib/api/customerApi";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCustomerModal = ({
  isOpen,
  onClose,
}: CreateCustomerModalProps) => {
  const queryClient = useQueryClient();
  const { mutate: createCustomer, isPending } = useCreateCustomerMutation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const resetForm = () => {
    setName("");
    setPhone("");
  };

  const handleCreateCustomer = () => {
    if (!name && !phone) {
      toast.warn("Please provide at least a name or phone number");
      return;
    }
    createCustomer(
      {
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Customer created successfully");
          onClose();
          resetForm();
          queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to create customer",
            );
          } else {
            toast.error("Failed to create customer");
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
      onConfirm={handleCreateCustomer}
      title="Create New Customer"
      description="Enter customer details"
      confirmText={isPending ? "Creating..." : "Create"}
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
          placeholder="Phone"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default CreateCustomerModal;
