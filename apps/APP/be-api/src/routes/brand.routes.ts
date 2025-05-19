import { Router } from 'express';
import { createBrand, getBrands, updateBrand, deleteBrand } from '../controllers/brand.controller.js';

const router = Router();

router.post('/brands', createBrand);
router.get('/brands', getBrands);
router.put('/brands/:id', updateBrand);
router.delete('/brands/:id', deleteBrand);

export default router;