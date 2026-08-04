"use client";
import { Input, Modal } from "@/components/ui";
import { useCreateCategoryMutation } from "@/lib/api/categoryApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCategoryModal = ({
  isOpen,
  onClose,
}: CreateCategoryModalProps) => {
  const queryClient = useQueryClient();
  const { mutate: createCategory, isPending } = useCreateCategoryMutation();
  const [name, setName] = useState("");

  const resetForm = () => {
    setName("");
  };

  const handleCreateCategory = () => {
    if (!name) {
      toast.warn("Please fill in the name");
      return;
    }
    createCategory(name, {
      onSuccess: () => {
        toast.success("Category created successfully");
        onClose();
        resetForm();
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Failed to create category")),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleCreateCategory}
      title="Create New Category"
      description="Enter category details"
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
      </div>
    </Modal>
  );
};

export default CreateCategoryModal;