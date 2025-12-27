# 📡 Documentación de API

## Base URL

```
http://localhost:4000
```

## Autenticación

Todos los endpoints (excepto `/login` y `/rate`) requieren un token JWT en el header:

```bash
Authorization: Bearer <token>
```

## Estructura de Respuesta

### Exitosa (2xx)
```json
{
  "success": true,
  "data": { /* datos */ },
  "timestamp": "2025-12-18T10:30:45.123Z"
}
```

### Error (4xx, 5xx)
```json
{
  "success": false,
  "message": "Descripción del error",
  "code": "ERROR_CODE",
  "timestamp": "2025-12-18T10:30:45.123Z"
}
```

## Roles y Permisos

```
ADMIN: Acceso completo
MECHANIC: Citas asignadas, reportes personales
CLIENT: Sus citas y vehículos
```

## Documentación Interactiva

Para ver la documentación interactiva completa:

1. Inicia el servidor: `npm run dev`
2. Abre: `http://localhost:4000/api-docs`

## Endpoints Principales

### 🔐 Autenticación

#### Login
```
POST /api/login
```
**Request:**
```json
{
  "email": "admin@servicollantas.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "1",
    "email": "admin@servicollantas.com",
    "role": "admin",
    "name": "Administrador"
  }
}
```

### 👥 Clientes

#### Obtener todos los clientes
```
GET /api/clients
```

#### Crear cliente
```
POST /api/clients
```
**Request:**
```json
{
  "name": "Juan García",
  "email": "juan@example.com",
  "phone": "+573001234567"
}
```

#### Obtener cliente por ID
```
GET /api/clients/:id
```

#### Actualizar cliente
```
PUT /api/clients/:id
```

### 🚗 Vehículos

#### Obtener vehículos del cliente
```
GET /api/clients/:clientId/vehicles
```

#### Crear vehículo
```
POST /api/vehicles
```
**Request:**
```json
{
  "client_id": "1",
  "make": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "license_plate": "ABC123"
}
```

### 📅 Citas

#### Obtener citas
```
GET /api/appointments
```

**Query params:**
- `status` - Filtrar por estado (pending, confirmed, completed, cancelled)
- `client_id` - Filtrar por cliente
- `mechanic_id` - Filtrar por mecánico

#### Crear cita
```
POST /api/appointments
```
**Request:**
```json
{
  "client_id": "1",
  "vehicle_id": "1",
  "service_id": "1",
  "date": "2025-12-25",
  "time": "10:00",
  "notes": "Revisión completa"
}
```

#### Actualizar estado de cita
```
PUT /api/appointments/:id
```
**Request:**
```json
{
  "status": "completed",
  "service_provider_id": "mechanic-1"
}
```

### 🔧 Mecánicos

#### Obtener mecánicos
```
GET /api/mechanics
```

#### Crear mecánico
```
POST /api/mechanics
```
**Request:**
```json
{
  "name": "Carlos López",
  "email": "carlos@workshop.com",
  "phone": "+573001234567"
}
```

#### Obtener estadísticas del mecánico
```
GET /api/mechanics/:id/stats
```

**Response:**
```json
{
  "id": "1",
  "name": "Carlos López",
  "total_appointments": 50,
  "completed_appointments": 45,
  "average_rating": 4.8,
  "completion_rate": 0.9
}
```

### 💰 Facturas

#### Obtener facturas
```
GET /api/invoices
```

#### Obtener factura por ID
```
GET /api/invoices/:id
```

#### Descargar PDF
```
GET /api/invoices/:id/pdf
```

### ⭐ Calificaciones

#### Obtener calificaciones del mecánico
```
GET /api/mechanics/:id/ratings
```

#### Calificar cita completada
```
POST /api/ratings
```
**Request:**
```json
{
  "appointment_id": "1",
  "rating": 5,
  "comment": "Excelente trabajo"
}
```

### 📊 Reportes

#### Dashboard administrativo
```
GET /api/reports/dashboard
```

#### Reportes por fecha
```
GET /api/reports/by-date?startDate=2025-01-01&endDate=2025-12-31
```

### 🏥 Health Check

```
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "environment": "production",
  "timestamp": "2025-12-18T10:30:45.123Z"
}
```

## Códigos de Error Comunes

| Código | Status | Descripción |
|--------|--------|-------------|
| 400 | 400 | Bad Request - Datos inválidos |
| 401 | 401 | Unauthorized - Token inválido |
| 403 | 403 | Forbidden - Sin permisos |
| 404 | 404 | Not Found - Recurso no encontrado |
| 409 | 409 | Conflict - Email duplicado |
| 429 | 429 | Too Many Requests - Rate limit |
| 500 | 500 | Internal Server Error |

## Rate Limiting

- **Global:** 100 solicitudes por 15 minutos
- **Login:** 5 intentos por 15 minutos

Cuando se excede el límite, recibirás:
```json
{
  "success": false,
  "message": "Demasiadas solicitudes de esta IP"
}
```

## Ejemplos con cURL

### Login
```bash
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@servicollantas.com",
    "password": "admin123"
  }'
```

### Obtener clientes (requiere token)
```bash
curl -X GET http://localhost:4000/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Crear cita
```bash
curl -X POST http://localhost:4000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "1",
    "vehicle_id": "1",
    "service_id": "1",
    "date": "2025-12-25",
    "time": "10:00"
  }'
```

## Recursos Adicionales

- Swagger UI: `http://localhost:4000/api-docs`
- Health Check: `http://localhost:4000/api/health`
- Base de datos: PostgreSQL en localhost:5432
