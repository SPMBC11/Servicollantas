console.log("Iniciando Servi-Collantas backend...");

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PDFDocument = require("pdfkit");
const { v4: uuidv4 } = require("uuid");
const { pool, testConnection, initializeTables, seedInitialData } = require("./database");
const config = require("./config");

const app = express();
app.use(cors());
app.use(express.json());

// --- helper: auth middleware ---
function authMiddleware(requiredRoles = []) {
  return (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "Missing auth token" });
    const token = auth.replace("Bearer ", "");
    try {
      const payload = jwt.verify(token, config.server.jwtSecret);
      if (requiredRoles.length && !requiredRoles.includes(payload.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

// --- auth endpoints ---
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await pool.connect();
    
    const result = await client.query(
      'SELECT id, email, password_hash, role, name FROM users WHERE email = $1',
      [email]
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const user = result.rows[0];
    
    if (!bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      config.server.jwtSecret,
      { expiresIn: "8h" }
    );
    
    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name }
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- services endpoints ---
app.get("/api/services", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM services ORDER BY name');
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo servicios:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/services", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    const client = await pool.connect();
    
    const result = await client.query(
      'INSERT INTO services (id, name, description, price, duration) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [`srv${Date.now()}`, name, description, price, duration]
    );
    
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creando servicio:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/services/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration } = req.body;
    const client = await pool.connect();
    
    const result = await client.query(
      'UPDATE services SET name = $1, description = $2, price = $3, duration = $4 WHERE id = $5 RETURNING *',
      [name, description, price, duration, id]
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error actualizando servicio:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/services/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    
    const result = await client.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
    
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }
    
    res.json({ message: "Servicio eliminado correctamente" });
  } catch (err) {
    console.error("Error eliminando servicio:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- clients endpoints ---
app.get("/api/clients", authMiddleware(["admin", "mechanic"]), async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM clients ORDER BY name');
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo clientes:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/clients", authMiddleware(["admin", "mechanic"]), async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const clientId = uuidv4();
    const client = await pool.connect();
    
    const result = await client.query(
      'INSERT INTO clients (id, name, phone, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [clientId, name, phone, email]
    );
    
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creando cliente:", err);
    if (err.code === '23505') { // Unique violation
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

// --- vehicles endpoints ---
app.get("/api/vehicles", authMiddleware(["admin", "mechanic"]), async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT v.*, c.name as client_name, c.email as client_email 
      FROM vehicles v 
      LEFT JOIN clients c ON v.client_id = c.id 
      ORDER BY v.make, v.model
    `);
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo vehículos:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/vehicles", authMiddleware(["admin", "mechanic"]), async (req, res) => {
  try {
    const { make, model, year, license_plate, client_id } = req.body;
    const vehicleId = uuidv4();
    const client = await pool.connect();
    
    const result = await client.query(
      'INSERT INTO vehicles (id, make, model, year, license_plate, client_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [vehicleId, make, model, year, license_plate, client_id]
    );
    
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creando vehículo:", err);
    if (err.code === '23505') { // Unique violation
      res.status(400).json({ message: "License plate already exists" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

// --- appointments/bookings endpoints ---
app.post("/api/bookings", async (req, res) => {
  try {
    const { client_id, vehicle_id, service_id, date, time, notes } = req.body;
    const appointmentId = uuidv4();
    const client = await pool.connect();
    
    const result = await client.query(
      'INSERT INTO appointments (id, client_id, vehicle_id, service_id, date, time, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [appointmentId, client_id, vehicle_id, service_id, date, time, notes]
    );
    
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creando cita:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/bookings", authMiddleware(["admin", "mechanic"]), async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT a.*, c.name as client_name, c.email as client_email, c.phone as client_phone,
             v.make, v.model, v.year, v.license_plate,
             s.name as service_name, s.price as service_price
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN vehicles v ON a.vehicle_id = v.id
      LEFT JOIN services s ON a.service_id = s.id
      ORDER BY a.date DESC, a.time DESC
    `);
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo citas:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/bookings/:id", authMiddleware(["admin", "mechanic"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const client = await pool.connect();
    
    const result = await client.query(
      'UPDATE appointments SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [status, notes, id]
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error actualizando cita:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- invoices endpoints ---
app.get("/api/invoices", authMiddleware(["admin"]), async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM invoices ORDER BY date DESC');
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo facturas:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/invoices/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM invoices WHERE id = $1', [id]);
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error obteniendo factura:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/invoices", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { client_name, client_email, vehicle_info, services, total, status } = req.body;
    const invoiceId = `INV-${Date.now()}`;
    const client = await pool.connect();
    
    const result = await client.query(
      'INSERT INTO invoices (id, client_name, client_email, vehicle_info, services, total, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [invoiceId, client_name, client_email, vehicle_info, JSON.stringify(services), total, status || 'pending']
    );
    
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creando factura:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/invoices/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    const result = await client.query('DELETE FROM invoices WHERE id = $1', [id]);
    client.release();
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    
    res.json({ ok: true });
  } catch (err) {
    console.error("Error eliminando factura:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- endpoint to return invoice PDF (admin) ---
app.get("/api/invoices/:id/pdf", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM invoices WHERE id = $1', [id]);
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    
    const inv = result.rows[0];
    
    // generate PDF with pdfkit
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const filename = `factura-${inv.id}.pdf`;
    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");
    
    // Pipe to response
    doc.pipe(res);
    
    // Header
    doc.fontSize(20).text("SERVI-COLLANTAS", { align: "center" });
    doc.moveDown(0.2);
    doc.fontSize(14).text("Factura Electrónica", { align: "center" });
    doc.moveDown(1);
    
    doc.fontSize(12).text(`Factura N°: ${inv.id}`);
    doc.text(`Fecha: ${new Date(inv.date).toLocaleString()}`);
    doc.moveDown(0.5);
    
    doc.text(`Cliente: ${inv.client_name}`);
    doc.text(`Email: ${inv.client_email}`);
    doc.text(`Vehículo: ${inv.vehicle_info}`);
    doc.moveDown(1);
    
    // table header
    doc.font("Helvetica-Bold");
    doc.text("Servicio", { continued: true, width: 400 });
    doc.text("Precio", { align: "right" });
    doc.font("Helvetica");
    doc.moveDown(0.5);
    
    const services = typeof inv.services === 'string' ? JSON.parse(inv.services) : inv.services;
    services.forEach(s => {
      doc.text(s.name, { continued: true, width: 400 });
      doc.text(`$${Number(s.price).toFixed(2)}`, { align: "right" });
    });
    
    doc.moveDown(1);
    doc.font("Helvetica-Bold");
    doc.text("Total", { continued: true, width: 400 });
    doc.text(`$${Number(inv.total).toFixed(2)}`, { align: "right" });
    
    doc.moveDown(2);
    doc.fontSize(10).text("Gracias por su preferencia.", { align: "center" });
    
    doc.end();
  } catch (err) {
    console.error("Error generando PDF:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- health check endpoint ---
app.get("/api/health", async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    res.json({ status: "OK", database: "Connected" });
  } catch (err) {
    res.status(500).json({ status: "Error", database: "Disconnected" });
  }
});

// --- initialize database and start server ---
async function startServer() {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      console.error("❌ No se pudo conectar a la base de datos. Verifica la configuración.");
      process.exit(1);
    }
    
    // Initialize tables
    await initializeTables();
    
    // Seed initial data
    await seedInitialData();
    
    // Start server
    app.listen(config.server.port, () => {
      console.log(`🚀 Servi-Collantas API running on http://localhost:${config.server.port}`);
      console.log(`📊 Base de datos: PostgreSQL`);
      console.log(`🔐 JWT Secret: ${config.server.jwtSecret.substring(0, 10)}...`);
    });
  } catch (err) {
    console.error("❌ Error iniciando servidor:", err);
    process.exit(1);
  }
}

startServer();