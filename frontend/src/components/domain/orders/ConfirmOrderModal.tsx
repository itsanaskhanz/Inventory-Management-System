"use client";
import CustomerPicker from "@/components/domain/orders/CustomerPicker";
import { Button, Icon, Input, Modal, Typography } from "@/components/ui";
import { formatCurrency } from "@/lib/format";
import { Customer } from "@/types/customer.types";
import { CartItem } from "@/types/order.types";
import clsx from "clsx";
import { useState } from "react";

interface ConfirmOrderModalProps {
  isOpen: boolean;
  total: number;
  items: CartItem[];
  selectedCustomer: Customer | null;
  onCustomerChange: (customer: Customer | null) => void;
  onConfirm: (cashReceived: string, markAsCompleted: boolean) => void;
  onClose: () => void;
}

const ConfirmOrderModal = ({
  isOpen,
  total,
  items,
  selectedCustomer,
  onCustomerChange,
  onConfirm,
  onClose,
}: ConfirmOrderModalProps) => {
  const [cashReceived, setCashReceived] = useState("");
  const [markAsCompleted, setMarkAsCompleted] = useState(false);

  const parsedCashReceived = Math.max(0, Number(cashReceived) || 0);
  const effectiveCashReceived = markAsCompleted ? total : Math.min(total, parsedCashReceived);
  const due = Math.max(0, total - effectiveCashReceived);
  const isPaidInFull = due === 0;

  const handleConfirm = () => {
    onConfirm(cashReceived, markAsCompleted);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleConfirm}
      title="Confirm Order"
      description="Are you sure you want to place this order?"
      confirmText="Confirm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Typography variant="body2" weight="medium">
            Customer
          </Typography>
          <CustomerPicker value={selectedCustomer} onChange={onCustomerChange} />
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border bg-background-secondary/60 p-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-background p-3 border border-border">
              <Typography variant="caption" color="secondary">
                Total
              </Typography>
              <Typography variant="h5" weight="bold" className="text-primary mt-0.5">
                {formatCurrency(total)}
              </Typography>
            </div>
            <div className="rounded-lg bg-background p-3 border border-border">
              <Typography variant="caption" color="secondary">
                Received
              </Typography>
              <Typography variant="h5" weight="bold" className="mt-0.5">
                {formatCurrency(effectiveCashReceived)}
              </Typography>
            </div>
            <div
              className={clsx(
                "rounded-lg p-3 border",
                isPaidInFull ? "bg-success/5 border-success/20" : "bg-danger/5 border-danger/20",
              )}
            >
              {isPaidInFull ? (
                <div className="flex flex-col items-center justify-center gap-1 pt-1">
                  <Icon name="Check" size="sm" className="text-success" />
                  <Typography variant="caption" color="secondary">
                    Paid in full
                  </Typography>
                </div>
              ) : (
                <>
                  <Typography variant="caption" color="secondary">
                    Due
                  </Typography>
                  <Typography variant="h5" weight="bold" className="text-danger mt-0.5">
                    {formatCurrency(due)}
                  </Typography>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Typography variant="body2" weight="medium">
              Cash Received
            </Typography>
            <div className="relative">
              <Input
                type="number"
                min={0}
                step={1}
                value={cashReceived}
                onChange={(e) => {
                  const raw = e.target.value;
                  const num = Number(raw) || 0;
                  setCashReceived(num > total ? String(total) : raw);
                  setMarkAsCompleted(num >= total);
                }}
                placeholder={`0`}
                disabled={markAsCompleted}
                fullWidth
                className="pl-11"
                leftIcon="Newspaper"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={markAsCompleted || !cashReceived}
                onClick={() => {
                  setCashReceived("");
                  setMarkAsCompleted(false);
                }}
              >
                Clear
              </Button>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={markAsCompleted}
            onClick={() => {
              const next = !markAsCompleted;
              setMarkAsCompleted(next);
              setCashReceived(next ? String(total) : "");
            }}
            className={clsx(
              "flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors cursor-pointer",
              markAsCompleted ? "border-success/40 bg-success/10" : "border-border bg-background hover:bg-background-tertiary",
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={clsx(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
                  markAsCompleted ? "bg-success" : "bg-foreground-tertiary/40",
                )}
              >
                <span
                  className={clsx(
                    "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
                    markAsCompleted && "translate-x-5",
                  )}
                />
              </span>
              <span className="flex flex-col text-left">
                <Typography variant="body2" weight="medium">
                  Mark as completed
                </Typography>
                <Typography variant="caption" color="secondary">
                  Full payment received
                </Typography>
              </span>
            </div>
            {markAsCompleted && <Icon name="Check" size="sm" className="shrink-0 text-success" />}
          </button>
        </div>

        <div className="rounded-xl border border-border p-4 flex flex-col gap-2">
          <Typography variant="body2" weight="bold" className="mb-1">
            Order Summary
          </Typography>
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <Typography variant="body2">
                {item.name} × {item.quantity}
              </Typography>
              <Typography variant="body2">{formatCurrency(item.price * item.quantity)}</Typography>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex items-center justify-between">
            <Typography variant="body1" weight="bold">
              Total
            </Typography>
            <Typography variant="body1" weight="bold" className="text-primary">
              {formatCurrency(total)}
            </Typography>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmOrderModal;
