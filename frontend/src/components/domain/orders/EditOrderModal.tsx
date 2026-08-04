"use client";
import { Input, Modal, Typography } from "@/components/ui";
import { ORDER_STATUSES } from "@/config/orderStatus";
import { useUpdateOrderMutation } from "@/lib/api/orderApi";
import { Order } from "@/types/order.types";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const EditOrderForm = ({
  order,
  isOpen,
  onClose,
}: EditOrderModalInnerProps) => {
  const queryClient = useQueryClient();
  const { mutate: updateOrder, isPending } = useUpdateOrderMutation();
  const initialStatus = order.status.toUpperCase();
  const [status, setStatus] = useState<string>(
    ORDER_STATUSES.includes(initialStatus as (typeof ORDER_STATUSES)[number])
      ? initialStatus
      : order.status,
  );
  const [customerName, setCustomerName] = useState(order.customerName ?? "");
  const [customerPhone, setCustomerPhone] = useState(order.customerPhone ?? "");

  const statusOptions = ORDER_STATUSES.includes(
    status as (typeof ORDER_STATUSES)[number],
  )
    ? ORDER_STATUSES
    : [...ORDER_STATUSES, status];

  const handleUpdateOrder = () => {
    updateOrder(
      {
        id: order.id,
        data: {
          status,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
        },
      },
      {
        onSuccess: () => {
          toast.success("Order updated successfully");
          onClose();
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.message || "Failed to update order",
            );
          } else {
            toast.error("Failed to update order");
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
      onConfirm={handleUpdateOrder}
      title="Edit Order"
      description={`Update order ${order.orderNumber}`}
      confirmText={isPending ? "Updating..." : "Update"}
      cancelText="Cancel"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Typography variant="body2" weight="medium">
            Status
          </Typography>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-background-secondary border-1 border-border text-foreground rounded-md px-4 py-1.5 w-full focus:outline-none focus:border-primary cursor-pointer"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Customer Name"
          placeholder="Enter customer name"
          fullWidth
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <Input
          label="Customer Phone"
          placeholder="Enter customer phone"
          fullWidth
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />
      </div>
    </Modal>
  );
};

interface EditOrderModalInnerProps {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
}

interface EditOrderModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

const EditOrderModal = ({ isOpen, order, onClose }: EditOrderModalProps) => {
  if (!order) return null;
  return (
    <EditOrderForm
      key={order.id}
      isOpen={isOpen}
      order={order}
      onClose={onClose}
    />
  );
};

export default EditOrderModal;
