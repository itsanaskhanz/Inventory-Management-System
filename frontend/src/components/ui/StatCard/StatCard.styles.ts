import type { StatCardVariant } from "./StatCard.types";

export const baseStyles =
  "group flex items-center justify-between gap-4 rounded-xl border border-border bg-background-secondary p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-border-dark";

export const iconContainerVariants: Record<StatCardVariant, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-background-tertiary text-foreground-secondary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

export const trendStyles = {
  positive: "text-success",
  negative: "text-danger",
} as const;