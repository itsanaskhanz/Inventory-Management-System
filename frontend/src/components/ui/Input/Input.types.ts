import { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  fullWidth?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  className?: string;
  inputSize?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg";
}
