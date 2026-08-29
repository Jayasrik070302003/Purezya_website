const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// @route   POST api/orders
// @desc    Create a new order
// @access  Public
router.post('/', orderController.createOrder);

// @route   GET api/orders/my-orders
// @desc    Get current user orders
// @access  Private
router.get('/my-orders', auth, orderController.getMyOrders);

module.exports = router;
