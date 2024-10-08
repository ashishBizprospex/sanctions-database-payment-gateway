import express from 'express';
import { createRazorpayOrder, paymentSuccess } from '../controller/paymentController.js';
// import { createRazorpayOrder, paymentSuccess } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', createRazorpayOrder);
router.post('/payment-success', paymentSuccess);

export default router;