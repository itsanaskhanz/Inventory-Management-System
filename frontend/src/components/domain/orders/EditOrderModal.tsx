"use client";
import { Modal, Typography } from "@/components/ui";
import appConfig from "@/config/app.config";
import { ORDER_STATUSES } from "@/config/orderStatus";
import { useGetAllCustomersQuery } from "@/lib/api/customerApi";
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
  const { data: customers } = useGetAllCustomersQuery(appConfig.maxFetchLimit);
  const initialStatus = order.status.toUpperCase();
  const [status, setStatus] = useState<string>(
    ORDER_STATUSES.includes(initialStatus as (typeof ORDER_STATUSES)[number])
      ? initialStatus
      : order.status,
  );
  const [customerId, setCustomerId] = useState(order.customerId ?? "");

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
          customerId: customerId || undefined,
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
        <div className="flex flex-col gap-2">
          <Typography variant="body2" weight="medium">
            Customer
          </Typography>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="bg-background-secondary border-1 border-border text-foreground rounded-md px-4 py-1.5 w-full focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="">No customer</option>
            {customers?.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name || "Unnamed"}
                {customer.phone ? ` (${customer.phone})` : ""}
              </option>
            ))}
          </select>
        </div>
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
