export interface Movie {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  categoryId: string;
  imageUrl: string[];
  slug: string;
}

export interface CartItem extends Movie {
  quantity: number;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
  totalAmount?: number;
}
