import type { Category } from "../../generated/prisma/client.js";

export interface ICreateCategory {
  name: string;
  userId: string;
}

export type CategoryWithCount = Omit<Category, "products"> & {
  productsCount: number;
};
