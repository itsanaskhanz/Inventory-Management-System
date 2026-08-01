import clsx from "clsx";
import { Icon } from "../Icon";
import { labelSizes, sizes } from "./Spinner.styles";
import { SpinnerProps } from "./Spinner.types";

const Spinner = ({ size = "md", label, className }: SpinnerProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-2",
        className,
      )}
    >
      <span className={clsx("animate-spin", sizes[size])}>
        <Icon name="Loader" />
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
