import type { Category } from "@/types/category.types";

export interface CategoryFilterProps {
  categories?: Category[];
  selected: string;
  onSelect: (categoryId: string) => void;
  className?: string;
}