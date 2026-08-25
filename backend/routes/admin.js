const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// @route   GET api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', adminController.getUsers);

// @route   GET api/admin/stats
// @desc    Get system stats
// @access  Admin
router.get('/stats', adminController.getStats);

// @route   GET api/admin/orders
// @desc    Get all orders
// @access  Admin
router.get('/orders', adminController.getOrders);

// @route   GET api/admin/orders/:id
// @desc    Get order details
// @access  Admin
router.get('/orders/:id', adminController.getOrderDetails);

module.exports = router;
