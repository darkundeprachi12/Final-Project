const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/initialize', transactionController.initializeDatabase);
router.get('/transactions', transactionController.listTransactions);
router.get('/statistics', transactionController.getStatistics);
router.get('/price-range', transactionController.getPriceRange);
router.get('/categories', transactionController.getCategories);
router.get('/combined', transactionController.getCombined);

module.exports = router;
