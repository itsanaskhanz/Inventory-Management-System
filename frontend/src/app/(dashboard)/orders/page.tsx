"use client";
import ReceiptModal from "@/components/domain/receipt/ReceiptModal";
import {
  Button,
  CategoryFilter,
  Icon,
  Input,
  Modal,
  Pagination,
  Select,
  Typography,
} from "@/components/ui";
import appConfig from "@/config/app.config";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useSearchCustomersQuery } from "@/lib/api/customerApi";
import { useCreateOrderMutation } from "@/lib/api/orderApi";
import { useSearchProductsQuery } from "@/lib/api/productApi";
import { getApiErrorMessage } from "@/lib/errorHandling";
import { formatCurrency } from "@/lib/format";
import { ReceiptData, ReceiptItem } from "@/lib/receipt";
import { useDebouncedValue } from "@/lib/useDebounce";
import { CreateOrder } from "@/types/order.types";
import { Customer } from "@/types/customer.types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const limit = appConfig.defaultPageLimit;
  const debouncedSearch = useDebouncedValue(search);
  const queryClient = useQueryClient();
  const { mutate: createOrder, isPending: isCreatingOrderLoading } =
    useCreateOrderMutation();
  const { data: categoriesResponse } = useGetCategoriesQuery(
    1,
    appConfig.maxFetchLimit,
  );
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

  const [customerSearch, setCustomerSearch] = useState("");
  const debouncedCustomerSearch = useDebouncedValue(customerSearch);
  const { data: customersData } = useSearchCustomersQuery(
    debouncedCustomerSearch,
    1,
    appConfig.maxFetchLimit,
  );
  const customers = customersData?.data?.customers || [];
  const [cartItems, setCartItems] = useState<
    { id: string; name: string; price: number; quantity: number }[]
  >([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [cashReceived, setCashReceived] = useState("");
  const [markAsCompleted, setMarkAsCompleted] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.0;
  const total = subtotal + tax;

  const effectiveCashReceived = markAsCompleted
    ? total
    : Math.max(0, Number(cashReceived) || 0);
  const due = Math.max(0, total - effectiveCashReceived);

  const handleConfirmOrder = () => {
    if (!selectedCustomerId) {
      toast.error("Please select a customer");
      return;
    }
    setIsConfirmOpen(false);
    handleSubmitOrder();
  };

  const handleSubmitOrder = () => {
    if (cartItems.length === 0) return;

    const payload: CreateOrder = {
      subtotal,
      tax,
      total,
      cashReceived: effectiveCashReceived,
      customerId: selectedCustomerId || undefined,
      products: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      })),
    };

    const receiptItems: ReceiptItem[] = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
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
          subtotal: createdOrder.subtotal,
          tax: createdOrder.tax,
          total: createdOrder.total,
          cashReceived: createdOrder.cashReceived,
          due: createdOrder.due,
        });
        setCartItems([]);
        setSelectedCustomerId("");
        setSelectedCustomer(null);
        setCashReceived("");
        setMarkAsCompleted(false);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      },
      onError: (error) =>
        toast.error(getApiErrorMessage(error, "Failed to place order")),
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
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
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search products..."
            fullWidth
            leftIcon="Search"
          />

          <CategoryFilter
            categories={categoriesData}
            selected={selectedCategory}
            onSelect={handleCategoryChange}
          />

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
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
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
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setCartItems([])}
            >
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
                <div
                  key={key}
                  className="flex items-center justify-between py-3 border-b border-border"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <Typography variant="body2" className="truncate">
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      {formatCurrency(item.price)} × {item.quantity}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="px-2"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Icon name="Minus" />
                    </Button>
                    <Typography variant="body2" className="w-6 text-center">
                      {item.quantity}
                    </Typography>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="px-2"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Icon name="Plus" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-3 mt-3 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <Typography variant="body2" color="secondary">
                Subtotal
              </Typography>
              <Typography variant="body2">
                {formatCurrency(subtotal)}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body2" color="secondary">
                Tax
              </Typography>
              <Typography variant="body2">{formatCurrency(tax)}</Typography>
            </div>
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
              {isCreatingOrderLoading
                ? "Placing order..."
                : `Pay ${formatCurrency(total)}`}
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
        <div className="flex flex-col gap-3">
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
              value={selectedCustomerId}
              onChange={(e) => {
                const customer = customers.find((c) => c.id === e.target.value);
                setSelectedCustomerId(e.target.value);
                setSelectedCustomer(customer ?? null);
              }}
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name || "Unnamed"}
                  {customer.phone ? ` (${customer.phone})` : ""}
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
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              placeholder={`0.00`}
              disabled={markAsCompleted}
              fullWidth
            />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={markAsCompleted}
                onChange={(e) => {
                  setMarkAsCompleted(e.target.checked);
                  if (e.target.checked) setCashReceived(String(total));
                }}
                className="h-4 w-4 accent-primary"
              />
              <Typography variant="body2">
                Mark as completed (full payment received)
              </Typography>
            </label>
          </div>
          <hr className="my-2" />
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm"
            >
              <Typography variant="body2">
                {item.name} × {item.quantity}
              </Typography>
              <Typography variant="body2">
                {formatCurrency(item.price * item.quantity)}
              </Typography>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex items-center justify-between">
            <Typography variant="body2" color="secondary">
              Subtotal
            </Typography>
            <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography variant="body2" color="secondary">
              Tax
            </Typography>
            <Typography variant="body2">{formatCurrency(tax)}</Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography variant="body1" weight="bold">
              Total
            </Typography>
            <Typography variant="body1" weight="bold">
              {formatCurrency(total)}
            </Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography variant="body2" color="secondary">
              Cash Received
            </Typography>
            <Typography variant="body2">
              {formatCurrency(effectiveCashReceived)}
            </Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography
              variant="body2"
              color={due > 0 ? "secondary" : "success"}
            >
              {due > 0 ? "Due" : "Change"}
            </Typography>
            <Typography
              variant="body2"
              className={due > 0 ? "" : "text-success"}
            >
              {due > 0
                ? formatCurrency(due)
                : formatCurrency(total - effectiveCashReceived)}
            </Typography>
          </div>
        </div>
      </Modal>

      <ReceiptModal
        isOpen={!!receiptData}
        receiptData={receiptData}
        onClose={() => setReceiptData(null)}
      />
    </>
  );
};

export default Page;
