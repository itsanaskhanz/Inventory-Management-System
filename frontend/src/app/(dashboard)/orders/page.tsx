"use client";
import {
  Button,
  CategoryFilter,
  Icon,
  Input,
  Modal,
  Pagination,
  Typography,
} from "@/components/ui";
import appConfig from "@/config/app.config";
import ReceiptModal from "@/components/domain/receipt/ReceiptModal";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useGetAllCustomersQuery } from "@/lib/api/customerApi";
import { useCreateOrderMutation } from "@/lib/api/orderApi";
import { useSearchProductsQuery } from "@/lib/api/productApi";
import { ReceiptData, ReceiptItem } from "@/lib/receipt";
import { useDebouncedValue } from "@/lib/useDebounce";
import { CreateOrder } from "@/types/order.types";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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

  const { data: customersData } = useGetAllCustomersQuery(
    appConfig.maxFetchLimit,
  );
  const customers = customersData || [];
  const [cartItems, setCartItems] = useState<
    { id: string; name: string; price: number; quantity: number }[]
  >([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.0;
  const total = subtotal + tax;

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

    const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
    const payload: CreateOrder = {
      subtotal,
      tax,
      total,
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
          orderNumber: createdOrder.orderNumber,
          orderId: createdOrder.id,
          createdAt: createdOrder.createdAt,
          customerName: selectedCustomer?.name ?? null,
          customerPhone: selectedCustomer?.phone ?? null,
          items: receiptItems,
          subtotal: createdOrder.subtotal,
          tax: createdOrder.tax,
          total: createdOrder.total,
        });
        setCartItems([]);
        setSelectedCustomerId("");
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Failed to place order");
        } else {
          toast.error("Failed to place order");
        }
      },
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
                    className="hover:bg-background-tertiary border border-border rounded-lg p-3 transition-all hover:border-primary/20 cursor-pointer"
                  >
                    <div className="aspect-square bg-background-tertiary rounded-lg mb-2 flex items-center justify-center">
                      <Icon
                        name="Package"
                        className="text-foreground-tertiary/40"
                      />
                    </div>
                    <Typography variant="body2" weight="medium">
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      Price: {product.price}
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

        <div className="lg:w-100 w-full h-full border border-border rounded-lg p-6 flex flex-col ">
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-center mb-4">
            <Typography variant="h3">
              {appConfig.appCurrencySymbol}
              {total.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="secondary">
              {cartItems.length} items
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

          <div className="flex-1 px-2 ">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <Icon name="ShoppingBag" className="mb-2 opacity-30" />
                <Typography variant="body2">Cart is empty</Typography>
              </div>
            ) : (
              cartItems.map((item, key) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-3 border-b border-border"
                >
                  <div className="flex-1">
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="caption" color="secondary">
                      {appConfig.appCurrencySymbol}
                      {item.price.toFixed(2)} × {item.quantity}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Icon name="Minus" />
                    </Button>
                    <Typography variant="body2">{item.quantity}</Typography>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Icon name="Plus" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <Typography variant="body2" color="secondary">
                Subtotal
              </Typography>
              <Typography variant="body2">
                {appConfig.appCurrencySymbol}
                {subtotal.toFixed(2)}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body2" color="secondary">
                Tax
              </Typography>
              <Typography variant="body2">
                {appConfig.appCurrencySymbol}
                {tax.toFixed(2)}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body1" weight="bold">
                Total
              </Typography>
              <Typography variant="body1" weight="bold">
                {appConfig.appCurrencySymbol}
                {total.toFixed(2)}
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
                : `Pay ${appConfig.appCurrencySymbol}${total.toFixed(2)}`}
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
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="rounded-md border border-border bg-background-secondary px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name || "Unnamed"}
                  {customer.phone ? ` (${customer.phone})` : ""}
                </option>
              ))}
            </select>
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
                {appConfig.appCurrencySymbol}
                {(item.price * item.quantity).toFixed(2)}
              </Typography>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex items-center justify-between">
            <Typography variant="body2" color="secondary">
              Subtotal
            </Typography>
            <Typography variant="body2">
              {appConfig.appCurrencySymbol}
              {subtotal.toFixed(2)}
            </Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography variant="body2" color="secondary">
              Tax
            </Typography>
            <Typography variant="body2">
              {appConfig.appCurrencySymbol}
              {tax.toFixed(2)}
            </Typography>
          </div>
          <div className="flex items-center justify-between">
            <Typography variant="body1" weight="bold">
              Total
            </Typography>
            <Typography variant="body1" weight="bold">
              {appConfig.appCurrencySymbol}
              {total.toFixed(2)}
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
