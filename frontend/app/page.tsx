'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import AddProductForm from '@/components/AddProductForm';
import { productApi, cartApi } from '@/lib/api';
import { Product, User, CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Plus, ShoppingCart } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      const items = await cartApi.getCart();
      setCartItems(items);
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalCount);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, [user]);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      alert('Please login to add items to cart');
      router.push('/login');
      return;
    }

    if (product.availability !== 'In Stock') {
      alert('Product is out of stock');
      return;
    }

    try {
      await cartApi.addToCart(product._id, 1);
      await fetchCart();
      alert(`Added ${product.name} to cart!`);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      const errorMessage = error.response?.data?.error || 'Failed to add item to cart';
      alert(errorMessage);
    }
  };

  const handleAddProduct = async (productData: Partial<Product>) => {
    try {
      await productApi.create(productData);
      await fetchProducts();
      setShowAddForm(false);
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Make sure you are logged in as Admin.');
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCartItems([]);
    setCartCount(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mindwhiz</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'Customer' && (
                  <div className="relative">
                    <Button variant="outline" size="sm" className="relative">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Button>
                  </div>
                )}
                <span className="text-sm text-muted-foreground">
                  {user.email} ({user.role})
                </span>
                <Button variant="outline" onClick={handleLogout} size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={handleLogin} size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Product Listing</h2>
          {user?.role === 'Admin' && (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </main>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          open={isModalOpen}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
          userRole={user?.role}
        />
      )}

      <AddProductForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  );
}
