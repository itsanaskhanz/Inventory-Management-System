import {
  TypographyVariant,
  TypographyWeight,
  TypographyColor,
  TypographyAlign,
} from "./Typography.types";

export const baseStyles = "";

export const variants: Record<TypographyVariant, string> = {
  h1: "text-4xl md:text-5xl font-bold tracking-tight",
  h2: "text-3xl md:text-4xl font-bold tracking-tight",
  h3: "text-2xl md:text-3xl font-semibold",
  h4: "text-xl md:text-2xl font-semibold",
  h5: "text-lg md:text-xl font-semibold",
  h6: "text-base md:text-lg font-semibold",
  body1: "text-base",
  body2: "text-sm",
  caption: "text-xs text-foreground-tertiary",
};

export const weights: Record<TypographyWeight, string> = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  bold: "font-bold",
};

export const colors: Record<TypographyColor, string> = {
  primary: "text-foreground",
  secondary: "text-foreground-secondary",
  danger: "text-danger",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
  muted: "text-foreground-tertiary",
};

export const aligns: Record<TypographyAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};
