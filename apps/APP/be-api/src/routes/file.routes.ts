import { Router } from 'express';
import { createFile, getFiles, getFileById, updateFile, deleteFile } from '../controllers/file.controller.js';

const router = Router();

router.post('/', createFile);
router.get('/', getFiles);
router.put('/:id', updateFile);
router.delete('/:id', deleteFile);
router.get('/:id', getFileById);

export default router;
