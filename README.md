# Mindwhiz - Full-Stack E-Commerce Module

A mini e-commerce application demonstrating frontend, backend, database, and API integration.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)

## Features

- ✅ Product listing page with grid layout (3 products per row on desktop)
- ✅ Product detail modal/page
- ✅ Login form with authentication
- ✅ Role-based access control (Admin/Customer)
- ✅ Add Product feature (Admin only)
- ✅ RESTful API endpoints
- ✅ MongoDB database integration
- ✅ Clean, minimal UI design

## Project Structure

```
mindwhiz/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   └── productController.ts
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts
│   │   ├── models/
│   │   │   ├── productModel.ts
│   │   │   └── userModel.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── productRoutes.ts
│   │   ├── scripts/
│   │   │   └── seed.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── fronted/
│   ├── components/
│   │   ├── AddProductForm.tsx
│   │   ├── ProductCard.tsx
│   │   └── ProductModal.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   └── product/
│   │       └── [id].tsx
│   ├── styles/
│   │   ├── globals.css
│   │   ├── Home.module.css
│   │   ├── Login.module.css
│   │   └── ProductDetail.module.css
│   ├── types/
│   │   └── index.ts
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
DB_URI=mongodb://localhost:27017/mindwhiz
SECRET_KEY=your-secret-key-here-change-in-production
NODE_ENV=development
```

**Note**: If using MongoDB Atlas, replace `DB_URI` with your Atlas connection string.

### 2. Database Seeding

Seed the database with sample products and users:

```bash
cd backend
npm run seed
```

This will create:
- 5 sample products
- 2 users:
  - **Admin**: admin@mindwhiz.com / password123
  - **Customer**: customer@mindwhiz.com / password123

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd fronted
npm install
```

Create a `.env.local` file in the `fronted` directory (optional, defaults to localhost:5000):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 5. Start Frontend Server

```bash
cd fronted
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product (Admin only, requires authentication)

### Authentication

- `POST /api/login` - Login user
  - Body: `{ "email": "string", "password": "string" }`
  - Returns: `{ "token": "string", "user": { "id": "string", "email": "string", "role": "Admin" | "Customer" } }`

### Health Check

- `GET /api/health` - Server health check

## Design Choices

### Architecture

1. **Separation of Concerns**: Clear separation between frontend and backend
2. **Type Safety**: TypeScript used throughout for better code quality
3. **RESTful API**: Standard REST conventions for API endpoints
4. **JWT Authentication**: Stateless authentication using JWT tokens
5. **Role-Based Access Control**: Admin and Customer roles with different permissions

### Frontend

- **Next.js**: Server-side rendering and routing capabilities
- **CSS Modules**: Scoped styling to prevent conflicts
- **Axios**: HTTP client for API calls with interceptors for token management
- **Local Storage**: Token and user data persistence

### Backend

- **Express**: Fast, unopinionated web framework
- **Mongoose**: MongoDB object modeling with schema validation
- **JWT**: Secure token-based authentication
- **bcrypt**: Password hashing for security

### Database

- **MongoDB**: NoSQL database for flexible schema
- **Mongoose Schemas**: Data validation and type safety

## Features Implementation

### Product Listing

- Grid layout responsive to screen size
- 3 products per row on desktop, adjusts for mobile
- Each product card displays image, name, price, and "View Details" button

### Product Details

- Modal overlay for quick viewing
- Full product information display
- "Add to Cart" button (UI only, can be extended)
- "Close" button to dismiss modal

### Authentication

- Simple email/password login
- JWT token stored in localStorage
- Automatic token attachment to API requests
- Role-based UI rendering (Admin sees "Add Product" button)

### Add Product (Admin Only)

- Form with validation
- All product fields (name, description, price, availability, image URL)
- Protected by authentication and role middleware
- Refreshes product list after successful creation

## Sample Login Credentials

After running the seed script:

- **Admin User**:
  - Email: `admin@mindwhiz.com`
  - Password: `password123`
  - Can view and add products

- **Customer User**:
  - Email: `customer@mindwhiz.com`
  - Password: `password123`
  - Can only view products

## Development

### Backend Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

### Backend (.env)

- `PORT` - Server port (default: 5000)
- `DB_URI` - MongoDB connection string
- `SECRET_KEY` - JWT secret key
- `NODE_ENV` - Environment (development/production)

### Frontend (.env.local)

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Future Enhancements

- Shopping cart functionality
- User registration
- Product search and filtering
- Image upload functionality
- Order management
- Payment integration
- Unit and integration tests
- Docker containerization

## License

This project is created for demonstration purposes.

