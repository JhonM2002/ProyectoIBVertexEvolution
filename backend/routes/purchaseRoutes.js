const express = require('express');
const { createPurchase, getProfitLoss, compareStock } = require('../controllers/purchaseController');

const router = express.Router();

// Ruta para registrar una compra
router.post('/create', createPurchase);

// Ruta para consultar ganancias/pérdidas
router.get('/profit-loss', getProfitLoss);

router.get('/compare/:symbol', compareStock);

module.exports = router;
