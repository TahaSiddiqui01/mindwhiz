export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  availability: 'In Stock' | 'Out of Stock';
  imageUrl?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'Admin' | 'Customer';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CartItem {
  _id: string;
  userId: string;
  productId: Product;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

