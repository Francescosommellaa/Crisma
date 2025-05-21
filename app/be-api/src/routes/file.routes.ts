import { Router } from 'express';
import {
  createFile,
  updateFile,
  deleteFile,
  getAllFiles
} from '../controllers/file.controller.js';

const router = Router();

router.get('/', getAllFiles);
router.post('/', createFile);
router.put('/:nome', updateFile);
router.delete('/:nome', deleteFile);

export default router;
