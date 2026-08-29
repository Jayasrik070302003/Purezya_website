const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Optional auth: visitors and logged-in users can both view
router.get('/', dashboardController.getDashboardData);

module.exports = router;
