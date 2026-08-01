import type { StatCardVariant } from "./StatCard.types";

export const baseStyles =
  "flex items-center justify-between gap-4 rounded-lg border border-border bg-background-secondary p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md";

export const iconContainerVariants: Record<StatCardVariant, string> = {
  primary: "bg-primary text-background",
  secondary: "bg-background-tertiary text-foreground",
  success: "bg-success text-background",
  warning: "bg-warning text-background",
  danger: "bg-danger text-background",
};

export const trendStyles = {
  positive: "text-success",
  negative: "text-danger",
} as const;
