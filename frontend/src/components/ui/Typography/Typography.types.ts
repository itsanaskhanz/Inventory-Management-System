import { ReactNode } from "react";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2"
  | "caption";
export type TypographyWeight = "light" | "normal" | "medium" | "bold";
export type TypographyColor =
  | "primary"
  | "secondary"
  | "danger"
  | "info"
  | "success"
  | "warning"
  | "muted";
export type TypographyAlign = "left" | "center" | "right";

export interface TypographyProps {
  children: ReactNode;
  variant?: TypographyVariant;
  className?: string;
  weight?: TypographyWeight;
  color?: TypographyColor;
  align?: TypographyAlign;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}
