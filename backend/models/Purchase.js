const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    symbol: { type: String, required: true }, // Símbolo de la acción (e.g., AAPL)
    quantity: { type: Number, required: true }, // Cantidad de acciones compradas
    purchasePrice: { type: Number, required: true }, // Precio al que se compró la acción
    purchaseDate: { type: Date, required: true }, // Fecha de la compra
});

module.exports = mongoose.model('Purchase', purchaseSchema);
