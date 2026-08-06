import { Status } from "../generated/prisma/enums.js";

export const getProductStatus = (stock: number, minStock: number): Status => {
  if (stock <= 0) return Status.OUT_OF_STOCK;
  if (stock <= minStock) return Status.LOW_STOCK;
  return Status.IN_STOCK;
};
