export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  rounded?: "sm" | "md" | "lg";
}
