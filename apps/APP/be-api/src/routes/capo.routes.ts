import { Router } from 'express';
import { getCapiByFile, createCapo } from '../controllers/capo.controller.js';

const router = Router();

router.post('/', createCapo);
router.get('/', getCapiByFile);

export default router;
