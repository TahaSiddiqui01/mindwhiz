import { Router } from 'express';
import { getAllProducts, getProductById, createProduct } from '../controllers/productController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, requireAdmin, createProduct);

export default router;

