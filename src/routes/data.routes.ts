import { Router } from 'express';
import { DataController } from '../controllers/data.controller';

const router = Router();

router.get('/', DataController.getAllData);
router.get('/:id', DataController.getData);
router.post('/', DataController.createData);
router.put('/:id', DataController.updateData);
router.delete('/:id', DataController.deleteData);

export default router; 