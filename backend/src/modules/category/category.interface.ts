import { IProduct } from "../product/product.interface.js";

interface ICategory {
  id: string;
  name: string;
  userId: string;
  products?: IProduct[];
  createdAt: Date;
  updatedAt: Date;
}

interface ICreateCategory {
  name: string;
  userId: string;
}
export { ICategory, ICreateCategory };
