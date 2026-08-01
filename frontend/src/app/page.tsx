// app/page.tsx
"use client";

import { Table } from "@/components/ui";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

// 📦 Product Type
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  rating: number;
};

// 📦 Dummy Products Data
const dummyProducts: Product[] = [
  {
    id: "P001",
    name: "Wireless Headphones Pro",
    category: "Electronics",
    price: 149.99,
    stock: 45,
    status: "In Stock",
    rating: 4.8,
  },
  {
    id: "P002",
    name: "Smart Fitness Watch",
    category: "Wearables",
    price: 199.99,
    stock: 12,
    status: "Low Stock",
    rating: 4.6,
  },
  {
    id: "P003",
    name: "Premium Cotton T-Shirt",
    category: "Clothing",
    price: 29.99,
    stock: 120,
    status: "In Stock",
    rating: 4.3,
  },
  {
    id: "P004",
    name: "Bluetooth Speaker X1",
    category: "Electronics",
    price: 89.99,
    stock: 0,
    status: "Out of Stock",
    rating: 4.1,
  },
  {
    id: "P005",
    name: "Leather Wallet Classic",
    category: "Accessories",
    price: 49.99,
    stock: 28,
    status: "In Stock",
    rating: 4.7,
  },
  {
    id: "P006",
    name: "4K Action Camera",
    category: "Electronics",
    price: 299.99,
    stock: 8,
    status: "Low Stock",
    rating: 4.9,
  },
  {
    id: "P007",
    name: "Running Shoes Air Max",
    category: "Footwear",
    price: 129.99,
    stock: 34,
    status: "In Stock",
    rating: 4.5,
  },
  {
    id: "P008",
    name: "Organic Green Tea Set",
    category: "Food & Beverage",
    price: 24.99,
    stock: 56,
    status: "In Stock",
    rating: 4.2,
  },
  {
    id: "P009",
    name: "Mechanical Keyboard RGB",
    category: "Electronics",
    price: 159.99,
    stock: 0,
    status: "Out of Stock",
    rating: 4.4,
  },
  {
    id: "P010",
    name: "Yoga Mat Premium",
    category: "Sports",
    price: 39.99,
    stock: 73,
    status: "In Stock",
    rating: 4.6,
  },
];

export default function Home() {
  // 👇 State for selected products
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [data] = useState<Product[]>(dummyProducts);

  // 👇 Toggle single product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  // 👇 Toggle all products selection
  const toggleAllProducts = () => {
    if (selectedProducts.length === data.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(data.map((p) => p.id));
    }
  };

  // 👇 Get status badge color
  const getStatusColor = (status: Product["status"]) => {
    const colors = {
      "In Stock": "bg-green-100 text-green-700",
      "Low Stock": "bg-yellow-100 text-yellow-700",
      "Out of Stock": "bg-red-100 text-red-700",
    };
    return colors[status];
  };

  // 📋 Define columns with checkbox
  const columns: ColumnDef<Product>[] = [
    // 👇 Checkbox Column
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={selectedProducts.length === data.length}
          onChange={toggleAllProducts}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(row.original.id)}
          onChange={() => toggleProductSelection(row.original.id)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      ),
    },
    // 👇 Product ID
    {
      accessorKey: "id",
      header: "Product ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-gray-500">
          {row.getValue("id")}
        </span>
      ),
    },
    // 👇 Product Name
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.getValue("name")}
          </div>
          <div className="text-xs text-gray-500">{row.original.category}</div>
        </div>
      ),
    },
    // 👇 Category
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
          {row.getValue("category")}
        </span>
      ),
    },
    // 👇 Price
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">
          ${row.getValue<number>("price").toFixed(2)}
        </span>
      ),
    },
    // 👇 Stock
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue<number>("stock");
        return (
          <span
            className={
              stock === 0
                ? "text-red-600 font-medium"
                : stock < 20
                  ? "text-yellow-600 font-medium"
                  : "text-gray-600"
            }
          >
            {stock}
          </span>
        );
      },
    },
    // 👇 Status
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue<Product["status"]>("status");
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
              status,
            )}`}
          >
            {status}
          </span>
        );
      },
    },
    // 👇 Rating
    {
      accessorKey: "rating",
      header: "⭐ Rating",
      cell: ({ row }) => {
        const rating = row.getValue<number>("rating");
        return (
          <span className="flex items-center gap-1">
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">★</span>
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📦 Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product inventory
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Selected count */}
          {selectedProducts.length > 0 && (
            <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md">
              {selectedProducts.length} selected
            </span>
          )}
          {/* Action buttons */}
          <button
            onClick={() => {
              if (selectedProducts.length === 0) {
                alert("Please select at least one product");
                return;
              }
              alert(`Selected ${selectedProducts.length} product(s)`);
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Bulk Action
          </button>
          <button
            onClick={() => {
              const totalValue = data
                .filter((p) => selectedProducts.includes(p.id))
                .reduce((sum, p) => sum + p.price, 0);
              alert(
                `Total value of selected products: $${totalValue.toFixed(2)}`,
              );
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            Calculate Value
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{data.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">In Stock</p>
          <p className="text-2xl font-bold text-green-600">
            {data.filter((p) => p.status === "In Stock").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-600">
            {data.filter((p) => p.status === "Low Stock").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">
            {data.filter((p) => p.status === "Out of Stock").length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table data={data} columns={columns} className="w-full" />
      </div>

      {/* Footer */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {data.length} products •{" "}
        {selectedProducts.length > 0
          ? `${selectedProducts.length} selected`
          : "No products selected"}
      </div>
    </div>
  );
}
