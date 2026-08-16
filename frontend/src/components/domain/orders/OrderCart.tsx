"use client";
import { Button, EmptyState, Icon, Typography } from "@/components/ui";
import { formatCurrency } from "@/lib/format";
import { CartItem } from "@/types/order.types";

interface OrderCartProps {
  items: CartItem[];
  total: number;
  totalItems: number;
  isCreatingOrderLoading: boolean;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}

const OrderCart = ({
  items,
  total,
  totalItems,
  isCreatingOrderLoading,
  onUpdateQuantity,
  onRemoveItem,
  onClear,
  onCheckout,
}: OrderCartProps) => {
  return (
    <div className="lg:w-[400px] xl:w-[440px] w-full lg:h-full max-h-[70vh] lg:max-h-none border border-border rounded-2xl bg-background flex flex-col overflow-hidden shadow-sm">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border bg-background-secondary/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Icon name="ShoppingBag" size="sm" />
            </span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </div>
          <div>
            <Typography variant="h6" weight="bold" className="leading-tight">
              Order Summary
            </Typography>
            <Typography variant="caption" color="muted">
              {totalItems === 0 ? "No items added" : `${totalItems} ${totalItems === 1 ? "item" : "items"} in cart`}
            </Typography>
          </div>
        </div>
        {items.length > 0 && (
          <Button size="sm" variant="ghost" className="text-foreground-tertiary hover:text-danger" onClick={onClear}>
            <Icon name="Trash" size="sm" />
            Clear all
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {items.length === 0 ? (
          <EmptyState
            icon="ShoppingBag"
            title="Your cart is empty"
            description="Click a product to add it to the order"
            className="flex-1"
            bordered
          />
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl border border-border bg-background-secondary/50 p-3 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md animate-slide-up"
            >
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon name="Package" size="sm" />
                </span>
                <div className="flex-1 min-w-0 pt-0.5">
                  <Typography variant="body2" weight="medium" className="truncate leading-tight">
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="muted">
                    {formatCurrency(item.price)} each
                  </Typography>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove item"
                  className="-m-1 p-1 rounded-md text-foreground-tertiary transition-colors hover:text-danger hover:bg-danger/10"
                >
                  <Icon name="Trash" size="sm" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-0.5 rounded-lg border border-border bg-background-secondary p-1">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                    title="Decrease quantity"
                    className="w-7 h-7 rounded-md bg-background flex items-center justify-center transition-colors hover:bg-background-tertiary hover:text-primary disabled:opacity-40 disabled:hover:bg-background disabled:hover:text-foreground"
                  >
                    <Icon name="Minus" size="sm" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    disabled={item.quantity >= item.stock}
                    title={item.quantity >= item.stock ? `Only ${item.stock} in stock` : "Increase quantity"}
                    className="w-7 h-7 rounded-md bg-background flex items-center justify-center transition-colors hover:bg-background-tertiary hover:text-primary disabled:opacity-40 disabled:hover:bg-background disabled:hover:text-foreground"
                  >
                    <Icon name="Plus" size="sm" />
                  </button>
                </div>
                <Typography variant="body2" weight="bold" className="text-primary tabular-nums">
                  {formatCurrency(item.price * item.quantity)}
                </Typography>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-border bg-background-secondary/40 px-5 py-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <Typography variant="body2" color="secondary">
            Subtotal
          </Typography>
          <Typography variant="body2" weight="medium" className="tabular-nums">
            {formatCurrency(total)}
          </Typography>
        </div>
        <div className="flex items-center justify-between">
          <Typography variant="h6" weight="bold">
            Total
          </Typography>
          <Typography variant="h5" weight="bold" className="text-primary tabular-nums">
            {formatCurrency(total)}
          </Typography>
        </div>
        <Button
          variant="primary"
          fullWidth
          size="lg"
          disabled={items.length === 0 || isCreatingOrderLoading}
          onClick={onCheckout}
          className="mt-1"
        >
          {isCreatingOrderLoading ? "Placing order..." : <>Checkout</>}
        </Button>
      </div>
    </div>
  );
};

export default OrderCart;
