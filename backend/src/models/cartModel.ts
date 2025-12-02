import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

const CartItemSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
}, {
  timestamps: true
});

// Compound index to ensure one cart item per user-product combination
CartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model<ICartItem>('CartItem', CartItemSchema);

