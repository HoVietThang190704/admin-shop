import { Product } from "./product.interface";

export interface CartItem {
  product: Product | string; // Can be full object if populated, or ID
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  products: CartItem[];
}
