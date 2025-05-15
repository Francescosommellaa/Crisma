import { Router } from 'express';
import { createBrand, getAllBrands, updateBrand, deleteBrand } from '../controllers/brand.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const router = Router();
router.post('/create', authMiddleware, createBrand);
router.get('/', authMiddleware, getAllBrands);
router.put('/update/:id', authMiddleware, updateBrand);
router.delete('/delete/:id', authMiddleware, deleteBrand);
export default router;
