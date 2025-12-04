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

// Update client
app.put("/api/clients/:id", authMiddleware(["admin", "mechanic"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email } = req.body;
    
    if (!name || !phone || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE clients SET name = $1, phone = $2, email = $3 WHERE id = $4 RETURNING *',
      [name, phone, email, id]
    );
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating client:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete client
app.delete("/api/clients/:id", authMiddleware(["admin", "mechanic"]), async (req, res) => {
  try {
    const { id } = req.params;
    
    const client = await pool.connect();
    const result = await client.query(
      'DELETE FROM clients WHERE id = $1 RETURNING id',
      [id]
    );
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }
    
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    console.error("Error deleting client:", err);
    res.status(500).json({ message: "Internal server error" });
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

// Get vehicles for authenticated client
app.get("/api/vehicles/client/:clientId", authMiddleware(), async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM vehicles WHERE client_id = $1 ORDER BY make, model',
      [clientId]
    );
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo vehículos del cliente:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/vehicles", authMiddleware(), async (req, res) => {
  const dbClient = await pool.connect();
  try {
    const { make, model, year, license_plate, client_id } = req.body;
    const vehicleId = uuidv4();
    
    // For clients, always use their own ID. For admin/mechanic, use provided client_id or user ID
    let finalClientId = client_id;
    
    if (req.user.role === "client") {
      finalClientId = req.user.id;
    } else if (!finalClientId) {
      finalClientId = req.user.id;
    }
    
    // Ensure the client exists in the clients table
    // Check if client exists
    let clientCheck = await dbClient.query(
      'SELECT id FROM clients WHERE id = $1',
      [finalClientId]
    );
    
    // If client doesn't exist, create one
    if (clientCheck.rows.length === 0) {
      await dbClient.query(
        'INSERT INTO clients (id, name, email, phone) VALUES ($1, $2, $3, $4)',
        [finalClientId, req.user.name || 'User', req.user.email || '', '']
      );
    }
    
    // Now insert the vehicle
    const result = await dbClient.query(
      'INSERT INTO vehicles (id, make, model, year, license_plate, client_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [vehicleId, make, model, year, license_plate, finalClientId]
    );
    
    dbClient.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    dbClient.release();
    console.error("Error creando vehículo:", err);
    if (err.code === '23505') { // Unique violation
      res.status(400).json({ message: "License plate already exists" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

// Update vehicle
app.put("/api/vehicles/:id", authMiddleware(["admin", "mechanic"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { make, model, year, license_plate } = req.body;
    
    if (!make || !model || !year || !license_plate) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const dbClient = await pool.connect();
    const result = await dbClient.query(
      'UPDATE vehicles SET make = $1, model = $2, year = $3, license_plate = $4 WHERE id = $5 RETURNING *',
      [make, model, year, license_plate, id]
    );
    dbClient.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating vehicle:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete vehicle
app.delete("/api/vehicles/:id", authMiddleware(["admin", "mechanic"]), async (req, res) => {
  try {
    const { id } = req.params;
    
    const dbClient = await pool.connect();
    const result = await dbClient.query(
      'DELETE FROM vehicles WHERE id = $1 RETURNING id',
      [id]
    );
    dbClient.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error("Error deleting vehicle:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- appointments/bookings endpoints ---
app.post("/api/bookings", authMiddleware(), async (req, res) => {
  try {
    const { client_id, vehicle_id, service_id, date, time, notes } = req.body;
    const appointmentId = uuidv4();
    
    // Validate required fields
    if (!client_id || !vehicle_id || !service_id || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const dbClient = await pool.connect();
    
    try {
      const result = await dbClient.query(
        'INSERT INTO appointments (id, client_id, vehicle_id, service_id, date, time, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [appointmentId, client_id, vehicle_id, service_id, date, time, notes || '']
      );
      
      dbClient.release();
      res.status(201).json(result.rows[0]);
    } catch (queryErr) {
      dbClient.release();
      
      // Check for foreign key constraint violations
      if (queryErr.code === '23503') {
        console.error("Foreign key constraint error:", queryErr.detail);
        return res.status(400).json({ message: "Invalid client, vehicle, or service ID" });
      }
      
      throw queryErr;
    }
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
    
    // Transform to match frontend expectations
    const invoices = result.rows.map(inv => ({
      id: inv.id,
      clientName: inv.client_name,
      clientEmail: inv.client_email,
      vehicle: inv.vehicle_info,
      services: inv.services || [],
      total: parseFloat(inv.total) || 0,
      date: inv.date,
      status: inv.status === 'pending' ? 'pendiente' : 'pagada'
    }));
    
    res.json(invoices);
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
    
    const inv = result.rows[0];
    const invoice = {
      id: inv.id,
      clientName: inv.client_name,
      clientEmail: inv.client_email,
      vehicle: inv.vehicle_info,
      services: inv.services || [],
      total: parseFloat(inv.total) || 0,
      date: inv.date,
      status: inv.status === 'pending' ? 'pendiente' : 'pagada'
    };
    
    res.json(invoice);
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

// --- endpoint to auto-generate invoice from a completed appointment ---
app.post("/api/invoices/from-appointment/:appointmentId", authMiddleware(["admin"]), async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const client = await pool.connect();
    
    // Get appointment details
    const appointmentResult = await client.query(
      `SELECT a.*, c.name as client_name, c.email as client_email, 
              v.license_plate, v.make, v.model, s.name as service_name, s.price
       FROM appointments a
       JOIN clients c ON a.client_id = c.id
       JOIN vehicles v ON a.vehicle_id = v.id
       JOIN services s ON a.service_id = s.id
       WHERE a.id = $1 AND a.status = 'completed'`,
      [appointmentId]
    );
    
    if (appointmentResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: "Completed appointment not found" });
    }
    
    const appointment = appointmentResult.rows[0];
    const invoiceId = `INV-${Date.now()}`;
    const vehicleInfo = `${appointment.make} ${appointment.model} (${appointment.license_plate})`;
    const services = [{ id: appointment.service_id, name: appointment.service_name, price: appointment.price }];
    const total = parseFloat(appointment.price) || 0;
    
    const invoiceResult = await client.query(
      `INSERT INTO invoices (id, client_name, client_email, vehicle_info, services, total, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [invoiceId, appointment.client_name, appointment.client_email, vehicleInfo, JSON.stringify(services), total, 'paid']
    );
    
    // Link invoice to appointment
    await client.query(
      'UPDATE appointments SET invoice_id = $1 WHERE id = $2',
      [invoiceId, appointmentId]
    );
    
    client.release();
    res.status(201).json(invoiceResult.rows[0]);
  } catch (err) {
    console.error("Error generating invoice from appointment:", err);
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

// --- reports endpoint ---
app.get("/api/reports", authMiddleware(['admin']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "startDate and endDate are required" });
    }
    
    const client = await pool.connect();
    
    // Total appointments in range
    const appointmentsResult = await client.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
       FROM appointments 
       WHERE DATE(date) >= $1 AND DATE(date) <= $2`,
      [startDate, endDate]
    );
    
    const stats = appointmentsResult.rows[0];
    
    // Service breakdown
    const servicesResult = await client.query(
      `SELECT 
        s.name as service_name,
        COUNT(a.id) as count,
        COALESCE(SUM(s.price), 0) as revenue
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE DATE(a.date) >= $1 AND DATE(a.date) <= $2 AND a.status = 'completed'
       GROUP BY s.id, s.name
       ORDER BY count DESC`,
      [startDate, endDate]
    );
    
    // Appointments by day
    const appointmentsByDayResult = await client.query(
      `SELECT 
        DATE(date) as date,
        COUNT(*) as count
       FROM appointments
       WHERE DATE(date) >= $1 AND DATE(date) <= $2
       GROUP BY DATE(date)
       ORDER BY DATE(date)`,
      [startDate, endDate]
    );
    
    // Calculate total revenue
    const revenueResult = await client.query(
      `SELECT COALESCE(SUM(s.price), 0) as total_revenue
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE DATE(a.date) >= $1 AND DATE(a.date) <= $2 AND a.status = 'completed'`,
      [startDate, endDate]
    );
    
    client.release();
    
    const reportData = {
      totalAppointments: parseInt(stats.total) || 0,
      completedAppointments: parseInt(stats.completed) || 0,
      pendingAppointments: parseInt(stats.pending) || 0,
      cancelledAppointments: parseInt(stats.cancelled) || 0,
      totalRevenue: parseFloat(revenueResult.rows[0].total_revenue) || 0,
      serviceBreakdown: servicesResult.rows.map(row => ({
        service_name: row.service_name,
        count: parseInt(row.count),
        revenue: parseFloat(row.revenue)
      })),
      appointmentsByDay: appointmentsByDayResult.rows.map(row => ({
        date: row.date.toISOString().split('T')[0],
        count: parseInt(row.count)
      }))
    };
    
    res.json(reportData);
  } catch (err) {
    console.error("Error fetching reports:", err);
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

// --- Endpoint: Get Mechanics with Statistics ---
app.get("/api/mechanics", authMiddleware(['admin']), async (req, res) => {
  try {
    // Obtener todos los mecánicos con sus estadísticas en una sola consulta
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.phone,
        u.email,
        COUNT(a.id)::integer as totalappointments,
        SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END)::integer as completedappointments,
        COALESCE(AVG(CASE WHEN a.status = 'completed' THEN 5 ELSE 0 END), 0)::float as averagerating
      FROM users u
      LEFT JOIN appointments a ON u.id = a.service_provider_id
      WHERE u.role = 'mechanic'
      GROUP BY u.id, u.name, u.phone, u.email
      ORDER BY u.name
    `);
    
    const mechanicsWithStats = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      totalAppointments: row.totalappointments || 0,
      completedAppointments: row.completedappointments || 0,
      averageRating: parseFloat(row.averagerating) || 0,
      status: 'active'
    }));
    
    res.json(mechanicsWithStats);
  } catch (err) {
    console.error("Error obteniendo mecánicos:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- Endpoint: Create Mechanic ---
app.post("/api/mechanics", authMiddleware(['admin']), async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    
    if (!name || !phone || !email) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
    
    const client = await pool.connect();
    
    // Generar contraseña aleatoria de 8 caracteres
    const password = Math.random().toString(36).substring(2, 10);
    const passwordHash = await bcrypt.hash(password, 10);
    const mechanicId = `mechanic-${Date.now()}`;
    
    // Crear mecánico
    const result = await client.query(
      `INSERT INTO users (id, email, password_hash, role, name, phone) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, email, phone`,
      [mechanicId, email, passwordHash, 'mechanic', name, phone]
    );
    
    client.release();
    
    // Devolver credenciales
    res.status(201).json({
      mechanic: result.rows[0],
      credentials: {
        email: email,
        password: password,
        message: "⚠️ IMPORTANTE: Guarda estas credenciales. No se mostrarán de nuevo."
      }
    });
  } catch (err) {
    console.error("Error creando mecánico:", err);
    if (err.code === '23505') {
      res.status(400).json({ message: "El email ya está registrado" });
    } else {
      res.status(500).json({ message: "Error al crear mecánico" });
    }
  }
});

// --- Endpoint: Update Mechanic ---
app.put("/api/mechanics/:id", authMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email } = req.body;
    
    if (!name || !phone || !email) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const result = await pool.query(
      `UPDATE users SET name = $1, phone = $2, email = $3 WHERE id = $4 AND role = 'mechanic' RETURNING id, name, email, phone`,
      [name, phone, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mecánico no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error actualizando mecánico:", err);
    if (err.code === '23505') {
      res.status(400).json({ message: "El email ya está registrado" });
    } else {
      res.status(500).json({ message: "Error al actualizar mecánico" });
    }
  }
});

// --- Endpoint: Regenerate Mechanic Password ---
app.post("/api/mechanics/regenerate-password", authMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "ID de mecánico requerido" });
    }

    // Generate new password
    const newPassword = Math.random().toString(36).substring(2, 10);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await pool.query(
      `UPDATE users SET password_hash = $1 WHERE id = $2 AND role = 'mechanic' RETURNING id, email`,
      [hashedPassword, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mecánico no encontrado" });
    }

    res.json({ 
      message: "Contraseña regenerada exitosamente",
      password: newPassword,
      email: result.rows[0].email
    });
  } catch (err) {
    console.error("Error regenerando contraseña:", err);
    res.status(500).json({ message: "Error al regenerar contraseña" });
  }
});

// --- Endpoint: Delete Mechanic ---
app.delete("/api/mechanics/:id", authMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 AND role = 'mechanic' RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mecánico no encontrado" });
    }

    res.json({ message: "Mecánico eliminado exitosamente" });
  } catch (err) {
    console.error("Error eliminando mecánico:", err);
    res.status(500).json({ message: "Error al eliminar mecánico" });
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