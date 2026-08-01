import { Icons } from "@/lib/icons";
import { clsx } from "clsx";
import { baseStyles, sizeStyles } from "./Icon.styles";
import type { IconProps } from "./Icon.types";
const Icon = ({ name, size = "md", color, className, ...props }: IconProps) => {
  const IconComponent = Icons[name as keyof typeof Icons];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      className={clsx(sizeStyles[size], baseStyles, className)}
      {...props}
    />
  );
};

export default Icon;
