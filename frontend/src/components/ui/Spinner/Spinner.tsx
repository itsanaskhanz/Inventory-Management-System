import clsx from "clsx";
import { labelSizes, sizes } from "./Spinner.styles";
import { SpinnerProps } from "./Spinner.types";

const Spinner = ({ size = "md", label, className }: SpinnerProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className={clsx(
          "inline-block animate-spin rounded-full border-2 border-border-dark border-t-primary",
          sizes[size],
        )}
      />
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