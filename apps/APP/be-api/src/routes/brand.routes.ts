import { Router } from 'express';
import { createBrand, getBrands, updateBrand, deleteBrand } from '../controllers/brand.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/brands',authMiddleware, createBrand);
router.get('/brands',authMiddleware, getBrands);
router.put('/brands/:id',authMiddleware, updateBrand);
router.delete('/brands/:id',authMiddleware, deleteBrand);

export default router;