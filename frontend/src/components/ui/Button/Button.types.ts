import { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.FormEvent) => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  rounded?: "sm" | "md" | "lg";
}
