const express = require('express');
const { createPurchase, getProfitLoss } = require('../controllers/purchaseController');

const router = express.Router();

// Ruta para registrar una compra
router.post('/create', createPurchase);

// Ruta para consultar ganancias/pérdidas
router.get('/profit-loss', getProfitLoss);

module.exports = router;
