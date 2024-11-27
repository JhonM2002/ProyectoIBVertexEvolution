const axios = require('axios');
const Purchase = require('../models/Purchase');

// Registrar una compra en la base de datos
const createPurchase = async (req, res) => {
    try {
        const { symbol, quantity, purchasePrice, purchaseDate } = req.body;

        if (!symbol || !quantity || !purchasePrice || !purchaseDate) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const newPurchase = new Purchase({
            symbol,
            quantity,
            purchasePrice,
            purchaseDate,
        });

        const savedPurchase = await newPurchase.save();
        res.status(201).json(savedPurchase);
    } catch (error) {
        console.error(`Error al registrar la compra: ${error.message}`);
        res.status(500).json({ error: 'Error al registrar la compra.' });
    }
};

// Consultar ganancias/pérdidas
const getProfitLoss = async (req, res) => {
    try {
        // Consultar todas las compras en la base de datos
        const purchases = await Purchase.find();

        if (purchases.length === 0) {
            return res.status(404).json({ error: 'No hay compras registradas.' });
        }

        const apiKey = process.env.API_KEY;
        const results = [];

        // Consultar el precio actual para cada acción
        for (const purchase of purchases) {
            const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${purchase.symbol}&apikey=${apiKey}`;
            const response = await axios.get(url);
            const data = response.data['Global Quote'];

            if (!data || !data['05. price']) {
                results.push({
                    symbol: purchase.symbol,
                    error: 'No se encontraron datos para esta acción en la API.',
                });
                continue;
            }

            const currentPrice = parseFloat(data['05. price']);
            const gainLossPercentage = ((currentPrice - purchase.purchasePrice) / purchase.purchasePrice) * 100;
            const gainLossDollars = (currentPrice - purchase.purchasePrice) * purchase.quantity;

            results.push({
                symbol: purchase.symbol,
                quantity: purchase.quantity,
                purchasePrice: purchase.purchasePrice,
                currentPrice,
                gainLossPercentage: gainLossPercentage.toFixed(2),
                gainLossDollars: gainLossDollars.toFixed(2),
            });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error(`Error al consultar ganancias/pérdidas: ${error.message}`);
        res.status(500).json({ error: 'Error al consultar ganancias/pérdidas.' });
    }
};

module.exports = { createPurchase, getProfitLoss };
