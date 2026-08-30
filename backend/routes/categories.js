const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');

// Public route to get categories for storefront & admin
router.get('/', categoryController.getAllCategories);

// Protected routes (Admin only)
router.post('/', auth, categoryController.createCategory);
router.put('/:id', auth, categoryController.updateCategory);
router.delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;
