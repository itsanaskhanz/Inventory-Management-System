import clsx from "clsx";
import { SelectProps } from "./Select.types";

const Select = ({ className, fullWidth = false, ...props }: SelectProps) => {
  return (
    <select
      className={clsx(
        "bg-background-secondary border border-border text-foreground rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm transition-colors duration-200",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
};

Select.displayName = "Select";

export default Select;
