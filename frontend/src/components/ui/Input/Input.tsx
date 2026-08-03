import clsx from "clsx";
import { useId, useState } from "react";
import { Icon } from "../Icon";
import { baseStyles, iconStyles, labelStyles, roundedSizes, sizes } from "./Input.styles";
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
  label,
  leftIcon,
  rightIcon,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const generatedId = useId();

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={generatedId} className={labelStyles}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <Icon name={leftIcon} size="sm" className={clsx(iconStyles, "left-3")} />
        )}
        <input
          id={label ? generatedId : undefined}
          placeholder={placeholder}
          className={clsx(
            className,
            baseStyles,
            fullWidth ? "w-full" : "",
            sizes[inputSize],
            roundedSizes[rounded],
            leftIcon && "pl-10",
            (isPassword || rightIcon) && "pr-10",
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
        {!isPassword && rightIcon && (
          <Icon name={rightIcon} size="sm" className={clsx(iconStyles, "right-3")} />
        )}
      </div>
    </div>
  );
};
