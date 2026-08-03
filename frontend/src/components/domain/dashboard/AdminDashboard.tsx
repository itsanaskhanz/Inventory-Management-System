"use client";
import { Icon, Input, Spinner, StatCard, Typography } from "@/components/ui";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useGetAllOrdersQuery } from "@/lib/api/orderApi";
import { useGetProductsQuery } from "@/lib/api/productApi";
import { Order } from "@/types/order.types";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const AdminDashboard = () => {
  const limit = 100;
  const { data: productsResponse, isLoading: isProductsLoading } =
    useGetProductsQuery(1, limit);
  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery(1, limit);
  const { data: ordersResponse, isLoading: isOrdersLoading } =
    useGetAllOrdersQuery(100);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const totalProducts = productsResponse?.data.pagination.total ?? 0;
  const totalCategories = categoriesResponse?.data.pagination.total ?? 0;
  const totalRevenue =
    ordersResponse?.reduce((sum, order) => sum + order.total, 0) ?? 0;

  const filteredOrders = useMemo(() => {
    if (!ordersResponse) return [];
    const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const end = endDate ? new Date(`${endDate}T23:59:59`) : null;
    return ordersResponse.filter((order) => {
      const createdAt = new Date(order.createdAt);
      if (start && createdAt < start) return false;
      if (end && createdAt > end) return false;
      return true;
    });
  }, [ordersResponse, startDate, endDate]);

  const chartData = useMemo(() => {
    const byDay = new Map<string, number>();
    for (const order of filteredOrders) {
      const day = formatDate(new Date(order.createdAt));
      byDay.set(day, (byDay.get(day) ?? 0) + order.total);
    }
    return Array.from(byDay.entries())
      .map(([date, revenue]) => ({ date, revenue: Number(revenue.toFixed(2)) }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredOrders]);

  const filteredRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);

  const isLoading =
    isProductsLoading || isCategoriesLoading || isOrdersLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Products"
          value={String(totalProducts)}
          icon={<Icon name="Package" />}
          variant="secondary"
        />
        <StatCard
          title="Total Categories"
          value={String(totalCategories)}
          icon={<Icon name="LayoutGrid" />}
          variant="secondary"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={<Icon name="TrendingUp" />}
          variant="secondary"
        />
      </div>

      <div className="rounded-lg border border-border p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Typography variant="h6" weight="bold">
            Revenue Chart
          </Typography>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Typography variant="caption" color="secondary">
                From
              </Typography>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                inputSize="sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Typography variant="caption" color="secondary">
                To
              </Typography>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                inputSize="sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Typography variant="caption" color="secondary">
            {filteredOrders.length} order(s) in selected range
          </Typography>
          <Typography variant="body1" weight="bold">
            ${filteredRevenue.toFixed(2)}
          </Typography>
        </div>

        {chartData.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-foreground-secondary">
            <Typography variant="body2">
              No revenue data for the selected range
            </Typography>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;