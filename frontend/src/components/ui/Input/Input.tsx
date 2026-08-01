import clsx from "clsx";
import { useState } from "react";
import { Icon } from "../Icon";
import { baseStyles, roundedSizes, sizes } from "./Input.styles";
import { InputProps } from "./Input.types";

export const Input = ({
  placeholder = "Type here",
  fullWidth = false,
  value = "",
  onChange,
  inputSize = "md",
  rounded = "sm",
  className,
  type = "text",
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative w-full">
      <input
        placeholder={placeholder}
        className={clsx(
          className,
          baseStyles,
          fullWidth ? "w-full" : "",
          sizes[inputSize],
          roundedSizes[rounded],
          isPassword && "pr-10",
        )}
        type={isPassword ? (showPassword ? "text" : "password") : type}
        onChange={onChange}
        value={value}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none cursor-pointer"
        >
          {showPassword ? <Icon name="Eye" /> : <Icon name="EyeClosed" />}
        </button>
      )}
    </div>
  );
};
