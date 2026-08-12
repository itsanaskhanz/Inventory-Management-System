"use client";
import { ConfirmDialog } from "@/components/ui";
import { useUpdateOrderMutation } from "@/lib/api/orderApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { formatCurrency } from "@/lib/format";
import { Order } from "@/types/order.types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface CancelOrderModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

const CancelOrderModal = ({ isOpen, order, onClose }: CancelOrderModalProps) => {
  const queryClient = useQueryClient();
  const { mutate: cancelOrder, isPending } = useUpdateOrderMutation();

  const handleCancelOrder = () => {
    if (!order) return;
    cancelOrder(
      { id: order.id, data: { status: "CANCELLED" } },
      {
        onSuccess: () => {
          toast.success("Order cancelled successfully");
          onClose();
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Failed to cancel order")),
      },
    );
  };

  return (
    <ConfirmDialog
      isOpen={isOpen && !!order}
      title="Cancel Order"
      description={
        order
          ? `This will cancel order ${order.id} (${formatCurrency(
              order.total,
            )}). Stock will be restored and the order will remain cancelled forever. This action cannot be undone.`
          : undefined
      }
      confirmText="Cancel Order"
      pendingText="Cancelling..."
      danger
      isPending={isPending}
      onConfirm={handleCancelOrder}
      onClose={onClose}
    />
  );
};

export default CancelOrderModal;