import clsx from "clsx";

export const statusStyles = {
  IN_STOCK: "bg-success/15 text-success border-success/30",
  LOW_STOCK: "bg-warning/15 text-warning border-warning/30",
  OUT_OF_STOCK: "bg-danger/15 text-danger border-danger/30",
  DISCONTINUED: "bg-foreground-tertiary/15 text-foreground-secondary border-border",
  COMPLETED: "bg-success/15 text-success border-success/30",
  PENDING: "bg-warning/15 text-warning border-warning/30",
  CANCELLED: "bg-danger/15 text-danger border-danger/30",
};

export const statusLabels = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
  DISCONTINUED: "Discontinued",
  COMPLETED: "Completed",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
};

export type StatusValue = keyof typeof statusStyles;

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const normalized = status.toUpperCase() as StatusValue;
  const style = statusStyles[normalized] ?? statusStyles.DISCONTINUED;
  const label = statusLabels[normalized] ?? status;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
        style,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
};

StatusBadge.displayName = "StatusBadge";

export default StatusBadge;