"use client";
import { Input, Modal } from "@/components/ui";
import { useUpdateCustomerMutation } from "@/lib/api/customerApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { Customer } from "@/types/customer.types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

const UpdateCustomerForm = ({
  customer,
  isOpen,
  onClose,
}: UpdateCustomerModalInnerProps) => {
  const queryClient = useQueryClient();
  const { mutate: updateCustomer, isPending } = useUpdateCustomerMutation();
  const [name, setName] = useState(customer.name ?? "");
  const [phone, setPhone] = useState(customer.phone ?? "");

  const handleUpdateCustomer = () => {
    if (!name && !phone) {
      toast.warn("Please provide at least a name or phone number");
      return;
    }
    updateCustomer(
      {
        id: customer.id,
        data: {
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Customer updated successfully");
          onClose();
          queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Failed to update customer")),
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleUpdateCustomer}
      title="Update Customer"
      description="Edit customer details"
      confirmText={isPending ? "Updating..." : "Update"}
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

interface UpdateCustomerModalInnerProps {
  isOpen: boolean;
  customer: Customer;
  onClose: () => void;
}

interface UpdateCustomerModalProps {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
}

const UpdateCustomerModal = ({
  isOpen,
  customer,
  onClose,
}: UpdateCustomerModalProps) => {
  if (!customer) return null;
  return (
    <UpdateCustomerForm
      key={customer.id}
      isOpen={isOpen}
      customer={customer}
      onClose={onClose}
    />
  );
};

export default UpdateCustomerModal;
