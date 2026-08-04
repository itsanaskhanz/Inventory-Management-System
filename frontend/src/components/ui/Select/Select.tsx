import clsx from "clsx";
import { SelectProps } from "./Select.types";

const Select = ({ className, fullWidth = false, ...props }: SelectProps) => {
  return (
    <select
      className={clsx(
        "bg-background-secondary border-1 border-border text-foreground rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary cursor-pointer",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
};

Select.displayName = "Select";

export default Select;
