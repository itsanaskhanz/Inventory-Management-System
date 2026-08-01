import { ReactNode } from "react";

export type StatCardVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

export interface StatCardTrend {
  value: number;
  isPositive: boolean;
}

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: StatCardTrend;
  variant?: StatCardVariant;
  className?: string;
}
