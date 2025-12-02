import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  availability: 'In Stock' | 'Out of Stock';
  imageUrl?: string;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  availability: {
    type: String,
    enum: ['In Stock', 'Out of Stock'],
    default: 'In Stock'
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);

