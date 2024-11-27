const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const purchaseRoutes = require('./routes/purchaseRoutes');

// Cargar variables de entorno
dotenv.config();
connectDB();

const app = express();

// Habilitar CORS
app.use(cors({
    origin: 'http://localhost:4200', // Permitir solicitudes desde este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/purchases', purchaseRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
