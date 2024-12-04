import express from 'express';
import { createDataCount, deleteDataCountController, getAllDataCountController, updateDataCountController } from '../controller/DataCountController.js';


const router = express.Router();

router.post('/create-data-count',createDataCount);
router.get('/get-data-count',getAllDataCountController);
router.put('/update-data-count/:id',updateDataCountController);
router.delete('/delete-data-count/:id',deleteDataCountController);
export default router;