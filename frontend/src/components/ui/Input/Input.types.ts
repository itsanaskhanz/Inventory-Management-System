export interface InputProps {
  placeholder?: string;
  fullWidth?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg";
}
