import clsx from "clsx";
import { baseStyles, roundedSizes, sizes, variants } from "./Button.styles";
import { ButtonProps } from "./Button.types";
const Button = ({
  children,
  className,
  onClick,
  variant = "primary",
  disabled = false,
  loading = false,
  size = "md",
  fullWidth = false,
  rounded = "sm",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        {
          "opacity-50 cursor-not-allowed": disabled || loading,
          "cursor-pointer": !disabled && !loading,
        },
        fullWidth && "w-full",
        rounded && roundedSizes[rounded],
        className,
      )}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <>Loading...</> : children}
    </button>
  );
};

Button.displayName = "Button";

export default Button;
