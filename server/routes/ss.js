import express from 'express';
const router = express.Router();
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders);
  
router.route('/my-orders').get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);
  
router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

export default router;
