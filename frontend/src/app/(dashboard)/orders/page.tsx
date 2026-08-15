"use client";
import CustomerPicker from "@/components/domain/orders/CustomerPicker";
import AddPaymentModal from "@/components/domain/payments/AddPaymentModal";
import ReceiptModal from "@/components/domain/receipt/ReceiptModal";
import { Button, CategoryFilter, Icon, Input, Modal, Pagination, Typography } from "@/components/ui";
import appConfig from "@/config/app.config";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useCreateOrderMutation } from "@/lib/api/orderApi";
import { useSearchProductsQuery } from "@/lib/api/productApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { formatCurrency } from "@/lib/format";
import { ReceiptData, ReceiptItem } from "@/lib/receipt";
import { useDebouncedValue } from "@/lib/useDebounce";
import { Customer } from "@/types/customer.types";
import { CreateOrder } from "@/types/order.types";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const limit = appConfig.defaultPageLimit;
  const debouncedSearch = useDebouncedValue(search);
  const { mutate: createOrder, isPending: isCreatingOrderLoading } = useCreateOrderMutation();
  const { data: categoriesResponse } = useGetCategoriesQuery(1, appConfig.maxFetchLimit);
  const categoriesData = categoriesResponse?.data.categories;
  const { data: productsResponse } = useSearchProductsQuery(
    debouncedSearch,
    selectedCategory === "All" ? null : selectedCategory,
    page,
    limit,
    true,
  );

  const { products: productsData, pagination } = productsResponse?.data || {};
  const totalPages = pagination?.totalPages || 1;

  const [cartItems, setCartItems] = useState<
    { id: string; name: string; price: number; costPrice: number; quantity: number }[]
  >([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cashReceived, setCashReceived] = useState("");
  const [markAsCompleted, setMarkAsCompleted] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [paymentCustomer, setPaymentCustomer] = useState<Customer | null>(null);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const parsedCashReceived = Math.max(0, Number(cashReceived) || 0);
  const effectiveCashReceived = markAsCompleted ? total : Math.min(total, parsedCashReceived);
  const due = Math.max(0, total - effectiveCashReceived);
  const isPaidInFull = due === 0;
  const handleConfirmOrder = () => {
    if (!selectedCustomer) {
      toast.error("Please select a customer");
      return;
    }
    setIsConfirmOpen(false);
    handleSubmitOrder();
  };

  const handleSubmitOrder = () => {
    if (cartItems.length === 0) return;

    const payload: CreateOrder = {
      total,
      cashReceived: effectiveCashReceived,
      customerId: selectedCustomer?.id || undefined,
      products: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        costPrice: item.costPrice,
      })),
    };

    const receiptItems: ReceiptItem[] = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    createOrder(payload, {
      onSuccess: (data) => {
        toast.success("Order placed successfully");
        const createdOrder = data.data.order;
        setReceiptData({
          orderId: createdOrder.id,
          createdAt: createdOrder.createdAt,
          customerName: selectedCustomer?.name ?? null,
          customerPhone: selectedCustomer?.phone ?? null,
          items: receiptItems,
          total: createdOrder.total,
          cashReceived: createdOrder.cashReceived,
          due: createdOrder.due,
        });
        setCartItems([]);
        setSelectedCustomer(null);
        setCashReceived("");
        setMarkAsCompleted(false);
      },
      onError: (error) => toast.error(getApiErrorMessage(error, "Failed to place order")),
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0),
    );
  };
  const addToCart = (id: string) => {
    const existing = cartItems.find((i) => i.id === id);

    const product = productsData?.find((p) => p.id === id);
    if (!product) return;

    if (existing) {
      updateQuantity(id, 1);
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          costPrice: product.costPrice,
          quantity: 1,
        },
      ]);
    }
  };
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  if (!appConfig.features.enablePos) {
    return (
      <div className="flex h-full items-center justify-center">
        <Typography variant="h5" weight="bold">
          POS is currently disabled
        </Typography>
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <Typography variant="h4" weight="bold">
              Point of Sale
            </Typography>
            <Button variant="secondary" size="sm" onClick={() => setIsAddPaymentOpen(true)}>
              <Icon name="HandCoins" size="sm" className="mr-1.5" />
              Add Payment
            </Button>
          </div>

          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search products..."
            fullWidth
            leftIcon="Search"
          />

          <CategoryFilter categories={categoriesData} selected={selectedCategory} onSelect={handleCategoryChange} />

          <div className="flex-1">
            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {productsData && productsData.length > 0 ? (
                productsData.map((product, key) => (
                  <button
                    key={key}
                    onClick={() => addToCart(product.id)}
                    className="group hover:bg-background-secondary border border-border rounded-xl p-3 transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="aspect-square bg-background-tertiary rounded-lg mb-2 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                      <Icon
                        name="Package"
                        className="text-foreground-tertiary/50 transition-colors group-hover:text-primary"
                      />
                    </div>
                    <Typography variant="body2" weight="medium" className="line-clamp-1">
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      {formatCurrency(product.price)}
                    </Typography>
                  </button>
                ))
              ) : (
                <div className="col-span-full h-64 flex flex-col items-center justify-center text-center">
                  <Icon name="Package" className="mb-2 opacity-30" />
                  <Typography variant="body2" color="secondary">
                    No products available
                  </Typography>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center mt-6">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </div>
        </div>

        <div className="lg:w-150 w-full h-full border border-border rounded-2xl bg-background p-6 flex flex-col shadow-sm">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-center mb-4">
            <Typography variant="h3" className="text-primary">
              {formatCurrency(total)}
            </Typography>
            <Typography variant="caption" color="secondary">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </Typography>
          </div>

          <div className="flex justify-between items-center mb-3">
            <Typography variant="h6" weight="bold">
              Order
            </Typography>
            <Button size="sm" variant="secondary" onClick={() => setCartItems([])}>
              Clear
            </Button>
          </div>

          <div className="flex-1 px-2 overflow-y-auto max-h-[40vh]">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-2">
                <Icon name="ShoppingBag" className="opacity-20" />
                <Typography variant="body2" color="secondary">
                  Cart is empty
                </Typography>
              </div>
            ) : (
              cartItems.map((item, key) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex-1 min-w-0 pr-2">
                    <Typography variant="body2" className="truncate">
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      {formatCurrency(item.price)} × {item.quantity}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button size="sm" variant="secondary" className="px-2" onClick={() => updateQuantity(item.id, -1)}>
                      <Icon name="Minus" />
                    </Button>
                    <Typography variant="body2" className="w-6 text-center">
                      {item.quantity}
                    </Typography>
                    <Button size="sm" variant="secondary" className="px-2" onClick={() => updateQuantity(item.id, 1)}>
                      <Icon name="Plus" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-3 mt-3 pt-4 border-t border-border">
            <div className="flex justify-between">
              <Typography variant="body1" weight="bold">
                Total
              </Typography>
              <Typography variant="body1" weight="bold" className="text-primary">
                {formatCurrency(total)}
              </Typography>
            </div>
            <Button
              variant="primary"
              fullWidth
              disabled={cartItems.length === 0 || isCreatingOrderLoading}
              onClick={() => setIsConfirmOpen(true)}
            >
              {isCreatingOrderLoading ? "Placing order..." : `Checkout ${formatCurrency(total)}`}
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmOrder}
        title="Confirm Order"
        description="Are you sure you want to place this order?"
        confirmText="Confirm"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Typography variant="body2" weight="medium">
              Customer
            </Typography>
            <CustomerPicker value={selectedCustomer} onChange={setSelectedCustomer} />
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
                markAsCompleted
                  ? "border-success/40 bg-success/10"
                  : "border-border bg-background hover:bg-background-tertiary",
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
            {cartItems.map((item) => (
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

      <ReceiptModal isOpen={!!receiptData} receiptData={receiptData} onClose={() => setReceiptData(null)} />

      <AddPaymentModal
        isOpen={isAddPaymentOpen}
        customer={paymentCustomer}
        onCustomerChange={setPaymentCustomer}
        onClose={() => setIsAddPaymentOpen(false)}
      />
    </>
  );
};

export default Page;
