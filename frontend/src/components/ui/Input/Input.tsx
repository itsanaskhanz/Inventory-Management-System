import clsx from "clsx";
import { InputProps } from "./Input.types";
import { baseStyles, roundedSizes, sizes } from "./Input.styles";

export const Input = ({
  placeholder = "Type here",
  fullWidth = false,
  value = "",
  onChange,
  size = "md",
  rounded = "sm",
  className,
  ...props
}: InputProps) => {
  return (
    <input
      placeholder={placeholder}
      className={clsx(
        className,
        baseStyles,
        fullWidth ? "w-full" : "",
        sizes[size],
        roundedSizes[rounded],
      )}
      onChange={onChange}
      value={value}
      {...props}
    />
  );
};
