import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import CartItem from '../models/cartModel';
import Product from '../models/productModel';
import mongoose from 'mongoose';

// Get all cart items for the authenticated user
export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const cartItems = await CartItem.find({ userId: userObjectId }).populate('productId');
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

// Add item to cart or update quantity if already exists
export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      res.status(400).json({ error: 'Product ID is required' });
      return;
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Check if product is in stock
    if (product.availability !== 'In Stock') {
      res.status(400).json({ error: 'Product is out of stock' });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({ userId: userObjectId, productId: productObjectId });

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
      await existingItem.save();
      const updatedItem = await CartItem.findById(existingItem._id).populate('productId');
      res.status(200).json(updatedItem);
    } else {
      // Create new cart item
      const cartItem = new CartItem({
        userId: userObjectId,
        productId: productObjectId,
        quantity
      });
      const savedItem = await cartItem.save();
      const populatedItem = await CartItem.findById(savedItem._id).populate('productId');
      res.status(201).json(populatedItem);
    }
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Item already in cart' });
      return;
    }
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 1) {
      res.status(400).json({ error: 'Valid quantity is required' });
      return;
    }

    // Convert string userId from JWT to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const cartItem = await CartItem.findOne({ _id: itemId, userId: userObjectId });
    if (!cartItem) {
      res.status(404).json({ error: 'Cart item not found' });
      return;
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    const updatedItem = await CartItem.findById(cartItem._id).populate('productId');
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

// Remove item from cart
export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { itemId } = req.params;

    // Convert string userId from JWT to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const cartItem = await CartItem.findOne({ _id: itemId, userId: userObjectId });
    if (!cartItem) {
      res.status(404).json({ error: 'Cart item not found' });
      return;
    }

    await CartItem.findByIdAndDelete(itemId);
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Clear entire cart for the user
export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Convert string userId from JWT to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    await CartItem.deleteMany({ userId: userObjectId });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

