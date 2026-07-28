import clsx from "clsx";
import { aligns, colors, variants, weights } from "./Typography.styles";
import { TypographyProps } from "./Typography.types";
import { JSX } from "react/jsx-runtime";

const variantToTag: Record<string, keyof JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body1: "p",
  body2: "p",
  caption: "p",
};
export const Typography = ({
  children,
  className,
  variant = "body1",
  weight = "normal",
  color = "primary",
  align = "left",
}: TypographyProps) => {
  const Component = variantToTag[variant] || "p";
  return (
    <Component
      className={clsx(
        variants[variant],
        weights[weight],
        colors[color],
        aligns[align],
        className,
      )}
    >
      {children}
    </Component>
  );
};

Typography.displayName = "Typography";
export default Typography;
