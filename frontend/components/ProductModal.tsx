'use client';

import { Product } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
  userRole?: 'Admin' | 'Customer';
}

export default function ProductModal({
  product,
  open,
  onClose,
  onAddToCart,
  userRole,
}: ProductModalProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
                <Package className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
            <p className="text-muted-foreground mb-4">{product.description}</p>
            <div className="space-y-2">
              <p>
                <strong>Price:</strong> <span className="text-primary font-bold text-xl">${product.price.toFixed(2)}</span>
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
          </div>
          <div className="flex gap-2">
            {onAddToCart && product.availability === 'In Stock' && userRole === 'Customer' && (
              <Button onClick={() => onAddToCart(product)} className="flex-1">
                Add to Cart
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

