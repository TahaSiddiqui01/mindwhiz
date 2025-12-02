import axios from 'axios';
import { Product, LoginResponse, CartItem } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },
  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },
  create: async (product: Partial<Product>): Promise<Product> => {
    const response = await api.post<Product>('/products', product);
    return response.data;
  },
};

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', { email, password });
    return response.data;
  },
};

export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await api.get<CartItem[]>('/cart');
    return response.data;
  },
  addToCart: async (productId: string, quantity: number = 1): Promise<CartItem> => {
    const response = await api.post<CartItem>('/cart', { productId, quantity });
    return response.data;
  },
  updateCartItem: async (itemId: string, quantity: number): Promise<CartItem> => {
    const response = await api.put<CartItem>(`/cart/${itemId}`, { quantity });
    return response.data;
  },
  removeFromCart: async (itemId: string): Promise<void> => {
    await api.delete(`/cart/${itemId}`);
  },
  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },
};

export default api;

