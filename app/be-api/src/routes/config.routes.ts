import { Router } from 'express';
import { setLocalDataPath, getLocalDataPath } from '../controllers/config.controller.js';

const router = Router();
router.post('/set-path', setLocalDataPath);
router.get('/get-path', getLocalDataPath);

export default router;
