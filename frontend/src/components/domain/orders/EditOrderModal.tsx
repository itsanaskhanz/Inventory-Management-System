"use client";
import { Input, Modal, Select, Typography } from "@/components/ui";
import appConfig from "@/config/app.config";
import { ORDER_STATUSES } from "@/config/orderStatus";
import { useSearchCustomersQuery } from "@/lib/api/customerApi";
import { useUpdateOrderMutation } from "@/lib/api/orderApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { formatCurrency } from "@/lib/format";
import { useDebouncedValue } from "@/lib/useDebounce";
import { Order } from "@/types/order.types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

const EditOrderForm = ({
  order,
  isOpen,
  onClose,
}: EditOrderModalInnerProps) => {
  const queryClient = useQueryClient();
  const { mutate: updateOrder, isPending } = useUpdateOrderMutation();
  const [customerSearch, setCustomerSearch] = useState("");
  const debouncedCustomerSearch = useDebouncedValue(customerSearch);
  const { data: customersResponse } = useSearchCustomersQuery(
    debouncedCustomerSearch,
    1,
    appConfig.maxFetchLimit,
  );
  const customers = customersResponse?.data?.customers || [];
  const initialStatus = order.status.toUpperCase();
  const [status, setStatus] = useState<string>(
    ORDER_STATUSES.includes(initialStatus as (typeof ORDER_STATUSES)[number])
      ? initialStatus
      : order.status,
  );
  const [customerId, setCustomerId] = useState(order.customerId ?? "");
  const [cashReceived, setCashReceived] = useState<string>(
    String(order.cashReceived ?? 0),
  );

  const parsedCashReceived = Math.max(0, Number(cashReceived) || 0);
  const due = Math.max(0, order.total - parsedCashReceived);
  const isCancelled = order.status.toUpperCase() === "CANCELLED";

  const statusOptions = ORDER_STATUSES.includes(
    status as (typeof ORDER_STATUSES)[number],
  )
    ? ORDER_STATUSES
    : [...ORDER_STATUSES, status];

  const handleCashReceivedChange = (value: string) => {
    setCashReceived(value);
    if (!isCancelled) {
      const parsed = Math.max(0, Number(value) || 0);
      setStatus(Math.max(0, order.total - parsed) <= 0 ? "COMPLETED" : "PENDING");
    }
  };

  const handleUpdateOrder = () => {
    updateOrder(
      {
        id: order.id,
        data: {
          status,
          customerId: customerId || undefined,
          cashReceived: parsedCashReceived,
        },
      },
      {
        onSuccess: () => {
          toast.success("Order updated successfully");
          onClose();
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Failed to update order")),
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
      description={`Update order ${order.id}`}
      confirmText={isPending ? "Updating..." : "Update"}
      cancelText="Cancel"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Typography variant="body2" weight="medium">
            Status
          </Typography>
          <Select
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="body2" weight="medium">
            Cash Received
          </Typography>
          <Input
            type="number"
            min={0}
            fullWidth
            value={cashReceived}
            onChange={(e) => handleCashReceivedChange(e.target.value)}
            disabled={isCancelled}
          />
          <div className="flex justify-between text-sm">
            <Typography variant="caption" color="secondary">
              Total
            </Typography>
            <Typography variant="caption">
              {formatCurrency(order.total)}
            </Typography>
          </div>
          <div className="flex justify-between text-sm">
            <Typography variant="caption" color="secondary">
              {due > 0 ? "Due" : "Change"}
            </Typography>
            <Typography variant="caption">
              {formatCurrency(
                due > 0 ? due : parsedCashReceived - order.total,
              )}
            </Typography>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="body2" weight="medium">
            Customer
          </Typography>
          <Input
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            placeholder="Search customers..."
            fullWidth
            inputSize="sm"
          />
          <Select
            fullWidth
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">No customer</option>
            {order.customer &&
            !customers.some((c) => c.id === order.customer?.id) ? (
              <option value={order.customer.id}>
                {order.customer.name || "Unnamed"}
                {order.customer.phone ? ` (${order.customer.phone})` : ""}
              </option>
            ) : null}
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name || "Unnamed"}
                {customer.phone ? ` (${customer.phone})` : ""}
              </option>
            ))}
          </Select>
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
