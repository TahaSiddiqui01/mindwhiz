'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productApi } from '@/lib/api';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Package } from 'lucide-react';
import Image from 'next/image';

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const data = await productApi.getById(productId);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">Product not found</p>
        <Button onClick={() => router.push('/')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => router.push('/')}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-32 w-32 text-muted-foreground" />
                </div>
              )}
            </div>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
              <div className="space-y-2 pt-4 border-t">
                <p>
                  <strong>Price:</strong>{' '}
                  <span className="text-primary font-bold text-2xl">
                    ${product.price.toFixed(2)}
                  </span>
                </p>
                <p>
                  <strong>Availability:</strong>{' '}
                  <span
                    className={
                      product.availability === 'In Stock'
                        ? 'text-primary font-semibold'
                        : 'text-destructive font-semibold'
                    }
                  >
                    {product.availability}
                  </span>
                </p>
              </div>
              {product.availability === 'In Stock' && (
                <Button className="w-full mt-6">Add to Cart</Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

