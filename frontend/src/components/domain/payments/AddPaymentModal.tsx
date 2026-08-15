"use client";
import CustomerPicker from "@/components/domain/orders/CustomerPicker";
import { Button, Input, Modal, Typography } from "@/components/ui";
import { useGetCustomerPaymentSummaryQuery } from "@/lib/api/customerApi";
import { useCreatePaymentMutation } from "@/lib/api/paymentApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { formatCurrency } from "@/lib/format";
import { Customer } from "@/types/customer.types";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "react-toastify";

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onCustomerChange?: (customer: Customer | null) => void;
}

const getInitials = (customer: Customer) => {
  const name = customer.name?.trim();
  if (name) {
    const initials = name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => Array.from(part)[0]?.toUpperCase() ?? "")
      .join("");
    if (initials) return initials;
  }
  if (customer.phone?.trim()) {
    return Array.from(customer.phone.trim())[0]?.toUpperCase() ?? "?";
  }
  return "?";
};

const AddPaymentModal = ({
  isOpen,
  onClose,
  customer,
  onCustomerChange,
}: AddPaymentModalProps) => {
  const [cashReceived, setCashReceived] = useState("");
  const [note, setNote] = useState("");
  const { mutate: createPayment, isPending: isCreatingPayment } =
    useCreatePaymentMutation();
  const {
    data: summaryResponse,
    isLoading: isSummaryLoading,
    isSuccess: isSummaryLoaded,
  } = useGetCustomerPaymentSummaryQuery(customer?.id ?? "");
  const selectable = !!onCustomerChange;

  const totalAmount = summaryResponse?.data.summary.totalAmount ?? 0;
  const totalDue = summaryResponse?.data.summary.totalDue ?? 0;
  const noBalance =
    !!customer && isSummaryLoaded && !isSummaryLoading && totalDue === 0;

  const handleClose = () => {
    if (isCreatingPayment) return;
    setCashReceived("");
    setNote("");
    onClose();
  };

  const handleCustomerChange = (c: Customer | null) => {
    setCashReceived("");
    onCustomerChange?.(c);
  };

  const handleConfirm = () => {
    if (isCreatingPayment) return;
    if (!customer) {
      toast.error("Please select a customer");
      return;
    }
    if (!isSummaryLoaded || isSummaryLoading) {
      toast.info("Loading customer balance, please wait…");
      return;
    }
    if (noBalance) {
      toast.error("This customer has no outstanding balance");
      return;
    }
    const amount = Number(cashReceived);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Please enter an amount greater than zero");
      return;
    }
    if (amount > totalDue) {
      toast.error(
        `Amount cannot be greater than the total due (${formatCurrency(totalDue)})`,
      );
      return;
    }
    createPayment(
      { customerId: customer.id, cashReceived: amount, note: note || undefined },
      {
        onSuccess: () => {
          toast.success("Payment added successfully");
          onClose();
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Failed to add payment")),
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      title="Add Payment"
      description={
        selectable
          ? "Select a customer and record the payment"
          : "Record a payment received from this customer"
      }
      confirmText={isCreatingPayment ? "Adding…" : "Add Payment"}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Typography variant="body2" weight="medium">
            Customer
          </Typography>
          {selectable ? (
            <CustomerPicker value={customer} onChange={handleCustomerChange} />
          ) : customer ? (
            <div className="flex items-center gap-2.5 rounded-lg border border-primary bg-primary/5 px-3.5 py-2.5">
              <div className="h-8 w-8 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <span className="text-xs font-semibold">
                  {getInitials(customer)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {customer.name?.trim() || "Unnamed"}
                </p>
                {customer.phone && (
                  <p className="text-xs text-foreground-secondary truncate">
                    {customer.phone}
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {customer ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-background-secondary border border-border p-3">
              <Typography variant="caption" color="secondary">
                Total Amount
              </Typography>
              <Typography variant="h5" weight="bold" className="mt-0.5">
                {formatCurrency(totalAmount)}
              </Typography>
            </div>
            <div
              className={clsx(
                "rounded-lg p-3 border",
                noBalance
                  ? "bg-success/5 border-success/20"
                  : "bg-danger/5 border-danger/20",
              )}
            >
              <Typography variant="caption" color="secondary">
                Total Due
              </Typography>
              <Typography
                variant="h5"
                weight="bold"
                className={clsx("mt-0.5", noBalance ? "text-success" : "text-danger")}
              >
                {formatCurrency(totalDue)}
              </Typography>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-background-secondary/60 p-4 text-center">
            <Typography variant="body2" color="secondary">
              Select a customer to view their balance
            </Typography>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Typography variant="body2" weight="medium">
            Amount
          </Typography>
          <Input
            type="number"
            min={0}
            step={1}
            value={cashReceived}
            onChange={(e) => {
              const raw = e.target.value;
              const num = Number(raw) || 0;
              setCashReceived(
                totalDue > 0 && num > totalDue ? String(totalDue) : raw,
              );
            }}
            placeholder="0"
            disabled={noBalance}
            fullWidth
            leftIcon="CircleDollarSign"
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={noBalance || !cashReceived}
              onClick={() => setCashReceived("")}
            >
              Clear
            </Button>
            {totalDue > 0 && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setCashReceived(String(totalDue))}
              >
                Full Due
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Typography variant="body2" weight="medium">
            Note
          </Typography>
          <Input
            placeholder="Optional note..."
            fullWidth
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddPaymentModal;