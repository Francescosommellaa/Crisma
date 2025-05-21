import { Router } from 'express';
import { createCapo, getCapiByFile } from '../controllers/capo.controller.js';

const router = Router();

router.get('/', getCapiByFile);
router.post('/', createCapo);

export default router;