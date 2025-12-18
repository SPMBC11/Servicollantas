// ServiCollantas Backend - Refactored Entry Point
console.log("Iniciando Servi-Collantas backend...");

const express = require("express");
const cors = require("cors");
const { pool, testConnection, initializeTables, seedInitialData } = require("./database");
const config = require("./config");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./utils/logger");

// Import routes
const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const mechanicRoutes = require("./routes/mechanicRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: process.env.NODE_ENV === 'production' ? 'Database connection failed' : err.message
    });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", appointmentRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/reports", reportRoutes);

// Global error handler (must be last)
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      logger.error("No se pudo conectar a la base de datos. Verifica la configuración.");
      process.exit(1);
    }
    
    // Initialize tables
    await initializeTables();
    
    // Seed initial data
    await seedInitialData();
    
    // Start server
    const port = config.server.port;
    app.listen(port, () => {
      logger.info(`✅ Servidor iniciado en puerto ${port}`);
      logger.info(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`📡 API disponible en http://localhost:${port}/api`);
    });
  } catch (err) {
    logger.error("Error iniciando servidor:", err);
    process.exit(1);
  }
}

startServer();

