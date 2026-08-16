"use client";
import ConfirmOrderModal from "@/components/domain/orders/ConfirmOrderModal";
import OrderCart from "@/components/domain/orders/OrderCart";
import AddPaymentModal from "@/components/domain/payments/AddPaymentModal";
import ReceiptModal from "@/components/domain/receipt/ReceiptModal";
import {
  Button,
  CategoryFilter,
  EmptyState,
  Icon,
  PageHeader,
  Pagination,
  SearchBar,
  Typography,
} from "@/components/ui";
import appConfig from "@/config/app.config";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useCreateOrderMutation } from "@/lib/api/orderApi";
import { useSearchProductsQuery } from "@/lib/api/productApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { formatCurrency } from "@/lib/format";
import { ReceiptData, ReceiptItem } from "@/lib/receipt";
import { Customer } from "@/types/customer.types";
import { CartItem, CreateOrder } from "@/types/order.types";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const limit = appConfig.defaultPageLimit;
  const { mutate: createOrder, isPending: isCreatingOrderLoading } = useCreateOrderMutation();
  const { data: categoriesResponse } = useGetCategoriesQuery(1, appConfig.maxFetchLimit);
  const categoriesData = categoriesResponse?.data.categories;
  const { data: productsResponse } = useSearchProductsQuery(
    submittedSearch,
    selectedCategory === "All" ? null : selectedCategory,
    page,
    limit,
    true,
  );

  const { products: productsData, pagination } = productsResponse?.data || {};
  const totalPages = pagination?.totalPages || 1;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmModalKey, setConfirmModalKey] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [paymentCustomer, setPaymentCustomer] = useState<Customer | null>(null);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirmOrder = (cashReceived: string, markAsCompleted: boolean) => {
    if (!selectedCustomer) {
      toast.error("Please select a customer");
      return;
    }
    setIsConfirmOpen(false);
    handleSubmitOrder(cashReceived, markAsCompleted);
  };

  const handleSubmitOrder = (cashReceived: string, markAsCompleted: boolean) => {
    if (cartItems.length === 0) return;

    const parsedCashReceived = Math.max(0, Number(cashReceived) || 0);
    const effectiveCashReceived = markAsCompleted ? total : Math.min(total, parsedCashReceived);

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
      },
      onError: (error) => toast.error(getApiErrorMessage(error, "Failed to place order")),
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.min(item.stock, Math.max(0, item.quantity + delta)) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };
  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };
  const addToCart = (id: string) => {
    const existing = cartItems.find((i) => i.id === id);

    const product = productsData?.find((p) => p.id === id);
    if (!product) return;

    if (product.stock <= 0) {
      toast.error(`"${product.name}" is out of stock`);
      return;
    }

    if (existing) {
      if (existing.quantity >= existing.stock) {
        toast.error(`Only ${existing.stock} ${existing.stock === 1 ? "unit" : "units"} of "${product.name}" in stock`);
        return;
      }
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
          stock: product.stock,
        },
      ]);
    }
  };
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    setSubmittedSearch(search.trim());
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
      <div className="flex flex-col lg:flex-row lg:h-full gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <PageHeader
            title="Orders"
            description="Manage your orders and payments"
            actions={
              <div className="flex items-center gap-2">
                <Button onClick={() => setIsAddPaymentOpen(true)} variant="primary" color="primary" size="sm">
                  Add Payment
                </Button>
              </div>
            }
          />

          <SearchBar
            value={search}
            onChange={handleSearchChange}
            onSearch={handleSearchSubmit}
            placeholder="Search products..."
          />

          <CategoryFilter categories={categoriesData} selected={selectedCategory} onSelect={handleCategoryChange} />

          <div className="flex-1">
            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {productsData && productsData.length > 0 ? (
                productsData.map((product, key) => {
                  const isOutOfStock = product.stock <= 0;
                  const isLowStock = !isOutOfStock && product.stock <= product.minStock;
                  return (
                    <button
                      key={key}
                      onClick={() => addToCart(product.id)}
                      disabled={isOutOfStock}
                      className={clsx(
                        "group border border-border rounded-xl p-3 transition-all duration-200",
                        isOutOfStock
                          ? "cursor-not-allowed"
                          : "hover:bg-background-secondary hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
                      )}
                    >
                      <div className="relative aspect-square bg-background-tertiary rounded-lg mb-2 flex items-center justify-center overflow-hidden transition-colors group-hover:bg-primary/10">
                        <Icon
                          name="Package"
                          className={clsx(
                            "transition-colors group-hover:text-primary",
                            isOutOfStock ? "text-foreground-tertiary/30" : "text-foreground-tertiary/50",
                          )}
                        />
                        {isOutOfStock && (
                          <span className="absolute inset-0 flex items-center justify-center bg-background-secondary/60">
                            <span className="rounded-md bg-danger/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                              Out of stock
                            </span>
                          </span>
                        )}
                        {!isOutOfStock && (
                          <span
                            className={clsx(
                              "absolute top-1.5 right-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums backdrop-blur-sm",
                              isLowStock ? "bg-amber-500/90 text-white" : "bg-background/80 text-foreground-secondary",
                            )}
                          >
                            {product.stock}
                          </span>
                        )}
                      </div>
                      <Typography
                        variant="body2"
                        weight="medium"
                        className={clsx("line-clamp-1", isOutOfStock && "text-foreground-tertiary")}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="secondary"
                        className={clsx(isOutOfStock && "line-through opacity-60")}
                      >
                        {formatCurrency(product.price)}
                      </Typography>
                    </button>
                  );
                })
              ) : (
                <EmptyState icon="Package" title="No products available" className="col-span-full h-64" />
              )}
            </div>
            <div className="flex items-center justify-center mt-6">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </div>
        </div>

        <OrderCart
          items={cartItems}
          total={total}
          totalItems={totalItems}
          isCreatingOrderLoading={isCreatingOrderLoading}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onClear={() => setCartItems([])}
          onCheckout={() => {
            setConfirmModalKey((k) => k + 1);
            setIsConfirmOpen(true);
          }}
        />
      </div>

      <ConfirmOrderModal
        key={confirmModalKey}
        isOpen={isConfirmOpen}
        total={total}
        items={cartItems}
        selectedCustomer={selectedCustomer}
        onCustomerChange={setSelectedCustomer}
        onConfirm={handleConfirmOrder}
        onClose={() => setIsConfirmOpen(false)}
      />

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
