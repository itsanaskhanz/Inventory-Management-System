import clsx from "clsx";
import { Icon } from "../Icon";
import { Typography } from "../Typography";
import { EmptyStateProps } from "./EmptyState.types";

const EmptyState = ({
  icon,
  title,
  description,
  action,
  bordered,
  compact,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2 px-4 py-4" : "gap-3 px-6 py-12",
        bordered &&
          "rounded-xl border-2 border-dashed border-border bg-background-secondary/40",
        className,
      )}
    >
      {icon && (
        <span
          className={clsx(
            "flex items-center justify-center rounded-full bg-background-tertiary text-foreground-tertiary",
            compact ? "h-9 w-9" : "h-14 w-14",
          )}
        >
          <Icon name={icon} size={compact ? "sm" : "md"} />
        </span>
      )}
      <div className="flex flex-col gap-1">
        <Typography variant="body1" weight="medium" className="text-foreground">
          {title}
        </Typography>
        {description && (
          <Typography variant="caption" color="muted">
            {description}
          </Typography>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
};

EmptyState.displayName = "EmptyState";

export default EmptyState;
