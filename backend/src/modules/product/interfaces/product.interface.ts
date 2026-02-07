export interface IProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category: string;
  unit?: string;
  isAvailable?: boolean;
  isBestSeller?: boolean;
  variants?: { name: string; price: number }[];
  createdAt: Date;
  updatedAt: Date;
}
