import express from 'express';
const router = express.Router();
import {
  createPaymentIntent,
  handleStripeWebhook,
} from '../controllers/stripeController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/webhook', handleStripeWebhook); // This route uses the raw body parser

export default router;
