"use client";
import { Icon, Input, Spinner, StatCard, Typography } from "@/components/ui";
import appConfig from "@/config/app.config";
import { useGetCategoriesQuery } from "@/lib/api/categoryApi";
import { useGetOrderStatsQuery } from "@/lib/api/orderApi";
import { useGetProductsQuery } from "@/lib/api/productApi";
import { formatCurrency } from "@/lib/format";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AdminDashboard = () => {
  const limit = appConfig.maxFetchLimit;
  const { data: productsResponse, isLoading: isProductsLoading } =
    useGetProductsQuery(1, limit);
  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery(1, limit);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: statsResponse, isLoading: isStatsLoading } =
    useGetOrderStatsQuery(startDate || undefined, endDate || undefined);

  const totalProducts = productsResponse?.data.pagination.total ?? 0;
  const totalCategories = categoriesResponse?.data.pagination.total ?? 0;
  const totalRevenue = statsResponse?.data.totalRevenue ?? 0;
  const filteredRevenue = statsResponse?.data.rangeRevenue ?? 0;
  const filteredOrdersCount = statsResponse?.data.rangeOrders ?? 0;
  const chartData = statsResponse?.data.dailyRevenue ?? [];

  const isLoading = isProductsLoading || isCategoriesLoading || isStatsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          value={formatCurrency(totalRevenue)}
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
            {filteredOrdersCount} order(s) in selected range
          </Typography>
          <Typography variant="body1" weight="bold">
            {formatCurrency(filteredRevenue)}
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
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    "Revenue",
                  ]}
                />
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
