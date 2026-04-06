export type Product = {
  _id: string;
  sku: string;
  title: string;
  slug: string;
  price: number;
  description: string;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
};
