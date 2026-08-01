import clsx from "clsx";
import { TrendingDown, TrendingUp } from "lucide-react";
import { baseStyles, trendStyles, variantStyles } from "./StatCard.styles";
import { StatCardProps } from "./StatCard.types";

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  variant = "primary",
  className,
}: StatCardProps) => {
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  const currentVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <div className={clsx(baseStyles, currentVariant.borderHover, className)}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="text-sm font-medium text-foreground-secondary truncate">
          {title}
        </span>
        <div
          className={clsx(
            "flex items-center justify-center w-10 h-10 rounded-lg shrink-0 text-lg",
            currentVariant.iconBg
          )}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {formattedValue}
        </div>

        {trend && (
          <div
            className={clsx(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shrink-0",
              trend.isPositive ? trendStyles.positive : trendStyles.negative
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

StatCard.displayName = "StatCard";

export default StatCard;
