export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category: string;
  featured: boolean;
  rating: number;
  reviews: number;
  inStock: boolean;
};


