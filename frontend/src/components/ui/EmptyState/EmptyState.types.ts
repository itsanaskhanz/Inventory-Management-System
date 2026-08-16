import { Icons } from "@/lib/icons";

export interface EmptyStateProps {
  icon?: keyof typeof Icons;
  title: string;
  description?: string;
  action?: React.ReactNode;
  bordered?: boolean;
  compact?: boolean;
  className?: string;
}
