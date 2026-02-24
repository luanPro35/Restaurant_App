export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string | { name: string };
}

export interface CartItem extends MenuItem {
  quantity: number;
}
