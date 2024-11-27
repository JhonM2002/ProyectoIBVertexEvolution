const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Sin opciones de configuración extra
        console.log('MongoDB connected');
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Detiene la ejecución si no se conecta
    }
};

module.exports = connectDB;
