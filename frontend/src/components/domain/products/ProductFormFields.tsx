"use client";
import { Input, Select, Textarea } from "@/components/ui";
import { Category } from "@/types/category.types";

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  costPrice: string;
  stock: string;
  minStock: string;
  categoryId: string;
  isActive: boolean;
}

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  costPrice: "",
  stock: "",
  minStock: "",
  categoryId: "",
  isActive: true,
};

interface ProductFormFieldsProps {
  values: ProductFormValues;
  onChange: (values: ProductFormValues) => void;
  categories: Category[];
}

const ProductFormFields = ({
  values,
  onChange,
  categories,
}: ProductFormFieldsProps) => {
  const set = (patch: Partial<ProductFormValues>) =>
    onChange({ ...values, ...patch });

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Name"
        fullWidth
        value={values.name}
        onChange={(e) => set({ name: e.target.value })}
      />
      <Select
        fullWidth
        value={values.categoryId}
        onChange={(e) => set({ categoryId: e.target.value })}
      >
        <option value="">Select Category (optional)</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      <Textarea
        placeholder="Description"
        rows={3}
        fullWidth
        value={values.description}
        onChange={(e) => set({ description: e.target.value })}
      />
      <Input
        placeholder="Price"
        fullWidth
        type="number"
        value={values.price}
        onChange={(e) => set({ price: e.target.value })}
      />
      <Input
        placeholder="Cost Price"
        fullWidth
        type="number"
        value={values.costPrice}
        onChange={(e) => set({ costPrice: e.target.value })}
      />
      <Input
        placeholder="Stock"
        fullWidth
        type="number"
        value={values.stock}
        onChange={(e) => set({ stock: e.target.value })}
      />
      <Input
        placeholder="Min Stock"
        fullWidth
        type="number"
        value={values.minStock}
        onChange={(e) => set({ minStock: e.target.value })}
      />
      <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => set({ isActive: e.target.checked })}
          className="h-4 w-4 accent-primary"
        />
        Active
      </label>
    </div>
  );
};

export default ProductFormFields;
