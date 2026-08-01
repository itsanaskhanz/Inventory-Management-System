import { clsx } from "clsx";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  baseStyles,
  iconContainerVariants,
  trendStyles,
} from "./StatCard.styles";
import type { StatCardProps } from "./StatCard.types";

const StatCard = ({
  title,
  value,
  icon,
  trend,
  variant = "primary",
  className,
}: StatCardProps) => {
  return (
    <div className={clsx(baseStyles, className)}>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-sm font-medium text-foreground-secondary">
          {title}
        </span>
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {trend && (
          <span
            className={clsx(
              "inline-flex items-center gap-1 text-sm font-medium",
              trendStyles[trend.isPositive ? "positive" : "negative"],
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div
        className={clsx(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-md",
          iconContainerVariants[variant],
        )}
      >
        {icon}
      </div>
    </div>
  );
};

StatCard.displayName = "StatCard";

export default StatCard;
