import clsx from "clsx";
import { labelSizes, sizes } from "./Spinner.styles";
import { SpinnerProps } from "./Spinner.types";

const Spinner = ({
  size = "md",
  className,
  label,
  emoji = "🔄",
}: SpinnerProps) => {
  return (
    <div className={clsx("flex items-center justify-center gap-2", className)}>
      <span className={clsx("inline-block animate-spin", sizes[size])}>
        {emoji}
      </span>
      {label && (
        <span className={clsx("text-foreground-secondary", labelSizes[size])}>
          {label}
        </span>
      )}
    </div>
  );
};

Spinner.displayName = "Spinner";

export default Spinner;
