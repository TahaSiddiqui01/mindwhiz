import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedData = async (): Promise<void> => {
  try {
    const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/mindwhiz';
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    // Seed products
    const products = [
      {
        name: 'Product 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus leo id nis, pulvinar, id dapibus quam ultrices.',
        price: 25.00,
        availability: 'In Stock' as const,
        imageUrl: 'https://www.shutterstock.com/image-photo/hamburg-germany-06192024-photo-english-600nw-2527038531.jpg'
      },
      {
        name: 'Product 2',
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
        price: 30.00,
        availability: 'In Stock' as const,
        imageUrl: 'https://www.shutterstock.com/image-photo/hamburg-germany-06192024-photo-english-600nw-2527038531.jpg'
      },
      {
        name: 'Product 3',
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        price: 20.00,
        availability: 'Out of Stock' as const,
        imageUrl: 'https://www.shutterstock.com/image-photo/hamburg-germany-06192024-photo-english-600nw-2527038531.jpg'
      },
      {
        name: 'Product 4',
        description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        price: 15.00,
        availability: 'In Stock' as const,
        imageUrl: 'https://www.shutterstock.com/image-photo/hamburg-germany-06192024-photo-english-600nw-2527038531.jpg'
      },
      {
        name: 'Product 5',
        description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
        price: 12.00,
        availability: 'In Stock' as const,
        imageUrl: 'https://www.shutterstock.com/image-photo/hamburg-germany-06192024-photo-english-600nw-2527038531.jpg'
      }
    ];

    await Product.insertMany(products);
    console.log('Products seeded successfully');

    // Seed users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
      {
        email: 'admin@mindwhiz.com',
        password: hashedPassword,
        role: 'Admin' as const
      },
      {
        email: 'customer@mindwhiz.com',
        password: hashedPassword,
        role: 'Customer' as const
      }
    ];

    await User.insertMany(users);
    console.log('Users seeded successfully');

    console.log('\nSample login credentials:');
    console.log('Admin: admin@mindwhiz.com / password123');
    console.log('Customer: customer@mindwhiz.com / password123');

    await mongoose.connection.close();
    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();

