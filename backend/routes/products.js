const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const requireAdmin = require('../middleware/adminAuth');

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   POST api/products
// @desc    Create a new product
// @access  Private (Admin)
router.post('/', requireAdmin, productController.createProduct);

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private (Admin)
router.delete('/:id', requireAdmin, productController.deleteProduct);

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private (Admin)
router.put('/:id', requireAdmin, productController.updateProduct);

module.exports = router;
