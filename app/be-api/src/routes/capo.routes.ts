import { Router } from 'express';
import { createCapo } from '../controllers/capo.controller.js';

const router = Router();

router.post('/', createCapo);

export default router;