import { Router } from 'express';
import {
  getGarments,
  addGarment,
  updateGarment,
  deleteGarment,
  exportGarmentsCSV
} from '../controllers/garments.controller.js';


const router = Router();

router.get('/:abbrev/:fileId', getGarments);
router.post('/:abbrev/:fileId', addGarment);
router.put('/:abbrev/:fileId/:id', updateGarment);
router.delete('/:abbrev/:fileId/:id', deleteGarment);
router.get('/:abbrev/:fileId/export', exportGarmentsCSV);

export default router;
