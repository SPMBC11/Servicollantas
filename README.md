# 🚗 ServiCollantas

Aplicación web completa para la gestión de una serviteca (taller automotriz) que permite administrar clientes, vehículos, mecánicos, citas, calificaciones y el rendimiento del taller.

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Características Principales](#-características-principales)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Base de Datos](#-base-de-datos)
- [API Endpoints](#-api-endpoints)
- [Autenticación y Roles](#-autenticación-y-roles)
- [Funcionalidades por Rol](#-funcionalidades-por-rol)
- [Sistema de Calificaciones](#-sistema-de-calificaciones)
- [Despliegue](#-despliegue)
- [Solución de Problemas](#-solución-de-problemas)

## 🛠️ Tecnologías

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos
- **Context API** - Gestión de estado global
- **UUID** - Generación de IDs únicos

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos relacional
- **JWT (jsonwebtoken)** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **PDFKit** - Generación de PDFs
- **UUID** - Generación de IDs únicos
- **CORS** - Control de acceso entre orígenes

## ✨ Características Principales

### 🔐 Módulo de Autenticación y Roles
- Sistema de login seguro con JWT
- Tres roles de usuario: **Administrador**, **Mecánico**, **Cliente**
- Control de acceso basado en roles (RBAC)
- Rutas protegidas según el rol del usuario
- Gestión de sesiones y tokens
- Cierre de sesión seguro

### 👥 Módulo de Clientes y Vehículos
- Registro y edición de clientes
- Gestión completa de vehículos asociados a clientes
- Los clientes visualizan sus vehículos sin mostrar la placa
- La placa solo es visible para el administrador
- Búsqueda y filtrado de clientes y vehículos

### 🔧 Módulo de Mecánicos
- Registro de mecánicos con datos de contacto
- Gestión de estado (activo/inactivo)
- Asignación de mecánicos a citas/servicios
- Panel de rendimiento individual por mecánico
- Estadísticas de citas completadas
- Calificación promedio basada en reseñas reales
- Configuración de perfil (editar nombre y contraseña)

### 📅 Módulo de Citas y Servicios
- Creación de citas por parte de los clientes
- Selección opcional de mecánico preferido durante la reserva
- Asignación/edición de mecánico por parte del administrador
- Visualización de citas según el rol:
  - **Clientes**: Sus propias citas
  - **Mecánicos**: Citas asignadas a ellos
  - **Administrador**: Todas las citas con filtros
- Actualización de estado (pendiente, confirmada, completada, cancelada)
- Integración con WhatsApp para notificaciones
- Generación automática de facturas para citas completadas

### ⭐ Sistema de Calificaciones
- Generación de links únicos de calificación por cita completada
- Portal público de calificación (`/rate/:token`)
- Formulario de calificación con estrellas (1-5)
- Comentarios opcionales del cliente
- Cálculo automático de calificación promedio por mecánico
- Tokens con expiración (30 días)
- Prevención de calificaciones duplicadas

### 📊 Dashboard y Reportes
- **Dashboard Administrativo**:
  - KPIs del taller (citas del día, servicios completados, etc.)
  - Desempeño de mecánicos (top 5)
  - Actividad reciente
  - Clientes destacados
- **Dashboard de Mecánicos**:
  - Citas totales, completadas y del día
  - Calificación promedio
  - Tasa de completitud
  - Próximas citas
  - Vista de todas las citas asignadas
  - Panel de desempeño individual

### 💰 Módulo de Facturación
- Generación automática de facturas para citas completadas
- Descarga de facturas en formato PDF
- Gestión de estado de facturas (pendiente, pagada)
- Historial completo de facturas

### 🔔 Sistema de Notificaciones
- Notificaciones toast (tipo móvil) en la parte superior
- Diferentes tipos: éxito, error, información, advertencia
- Auto-dismiss después de 5 segundos
- Animaciones suaves de entrada/salida
- Notificaciones compactas y no intrusivas

## 📁 Estructura del Proyecto

```
ServiCollantas/
├── project/
│   ├── frontend/                 # Aplicación React
│   │   ├── src/
│   │   │   ├── components/       # Componentes React
│   │   │   │   ├── admin/       # Componentes del panel de administrador
│   │   │   │   ├── client/      # Componentes para clientes
│   │   │   │   ├── mechanic/    # Componentes del panel de mecánico
│   │   │   │   ├── auth/        # Componentes de autenticación
│   │   │   │   ├── public/      # Componentes públicos (calificaciones)
│   │   │   │   └── ui/          # Componentes UI reutilizables
│   │   │   ├── context/         # Context API (Booking, Settings, Notifications)
│   │   │   ├── services/        # Servicios de API
│   │   │   ├── types/           # Definiciones de TypeScript
│   │   │   ├── assets/          # Imágenes y recursos
│   │   │   ├── App.tsx          # Componente principal
│   │   │   └── main.tsx         # Punto de entrada
│   │   ├── public/              # Archivos públicos
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── backend/                  # API Node.js/Express
│   │   ├── src/
│   │   │   ├── index.cjs        # Servidor Express principal
│   │   │   ├── database.js      # Configuración y esquema de BD
│   │   │   └── config.js        # Configuración del servidor
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── README.md                 # Documentación del proyecto
│
├── README.md                     # Este archivo
└── package.json
```

## 📦 Requisitos Previos

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **PostgreSQL** (versión 12 o superior)
- **Git** (opcional, para clonar el repositorio)

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/SPMBC11/Servicollantas.git
cd Servicollantas
```

### 2. Instalar Dependencias del Backend

```bash
cd project/backend
npm install
```

### 3. Instalar Dependencias del Frontend

```bash
cd ../frontend
npm install
```

## ⚙️ Configuración

### Variables de Entorno del Backend

Crear un archivo `.env` en `project/backend/`:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=servicollantas
DB_USER=postgres
DB_PASSWORD=tu_contraseña

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro
JWT_EXPIRES_IN=24h

# Servidor
PORT=4000
NODE_ENV=development

# Frontend URL (para links de calificación)
FRONTEND_URL=http://localhost:5173
```

### Variables de Entorno del Frontend

Crear un archivo `.env` en `project/frontend/`:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_API_BASE_URL=http://localhost:4000
```

### Configurar Base de Datos

1. Crear la base de datos PostgreSQL:

```bash
psql -U postgres
CREATE DATABASE servicollantas;
\q
```

2. El backend creará automáticamente las tablas al iniciarse por primera vez.

## ▶️ Ejecución

### Desarrollo

#### Terminal 1 - Backend
```bash
cd project/backend
npm run dev
```
El servidor estará disponible en: **http://localhost:4000**

#### Terminal 2 - Frontend
```bash
cd project/frontend
npm run dev
```
La aplicación estará disponible en: **http://localhost:5173**

### Producción

#### Backend
```bash
cd project/backend
npm start
```

#### Frontend
```bash
cd project/frontend
npm run build
npm run preview
```

## 🗄️ Base de Datos

### Esquema de Tablas

#### `users`
Almacena todos los usuarios del sistema (admin, mechanic, client).

```sql
- id (VARCHAR) - ID único
- email (VARCHAR) - Email único
- password_hash (VARCHAR) - Contraseña hasheada
- role (VARCHAR) - 'admin', 'mechanic', 'client'
- name (VARCHAR) - Nombre completo
- phone (VARCHAR) - Teléfono
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `services`
Catálogo de servicios disponibles.

```sql
- id (VARCHAR) - ID único
- name (VARCHAR) - Nombre del servicio
- description (TEXT) - Descripción
- price (DECIMAL) - Precio
- duration (INTEGER) - Duración en minutos
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `clients`
Información de clientes.

```sql
- id (VARCHAR) - ID único
- name (VARCHAR) - Nombre completo
- phone (VARCHAR) - Teléfono
- email (VARCHAR) - Email único
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `vehicles`
Vehículos de los clientes.

```sql
- id (VARCHAR) - ID único
- make (VARCHAR) - Marca
- model (VARCHAR) - Modelo
- year (INTEGER) - Año
- license_plate (VARCHAR) - Placa única
- client_id (VARCHAR) - FK a clients
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `appointments`
Citas/reservas del taller.

```sql
- id (VARCHAR) - ID único
- client_id (VARCHAR) - FK a clients
- vehicle_id (VARCHAR) - FK a vehicles
- service_id (VARCHAR) - FK a services
- date (DATE) - Fecha de la cita
- time (TIME) - Hora de la cita
- status (VARCHAR) - 'pending', 'confirmed', 'completed', 'cancelled'
- notes (TEXT) - Notas adicionales
- invoice_id (VARCHAR) - FK a invoices (opcional)
- service_provider_id (VARCHAR) - FK a users (mecánico asignado)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `invoices`
Facturas generadas.

```sql
- id (VARCHAR) - ID único
- client_name (VARCHAR) - Nombre del cliente
- client_email (VARCHAR) - Email del cliente
- vehicle_info (VARCHAR) - Información del vehículo
- services (JSONB) - Servicios facturados
- total (DECIMAL) - Total a pagar
- date (TIMESTAMP) - Fecha de factura
- status (VARCHAR) - 'pending', 'paid'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `ratings`
Calificaciones de mecánicos por los clientes.

```sql
- id (VARCHAR) - ID único
- appointment_id (VARCHAR) - FK a appointments (único)
- mechanic_id (VARCHAR) - FK a users (mecánico calificado)
- rating (INTEGER) - Calificación 1-5
- comment (TEXT) - Comentario opcional
- client_name (VARCHAR) - Nombre del cliente
- client_email (VARCHAR) - Email del cliente
- created_at (TIMESTAMP)
```

#### `rating_tokens`
Tokens únicos para links de calificación.

```sql
- id (VARCHAR) - ID único
- appointment_id (VARCHAR) - FK a appointments
- token (VARCHAR) - Token único
- expires_at (TIMESTAMP) - Fecha de expiración
- used (BOOLEAN) - Si ya fue usado
- created_at (TIMESTAMP)
```

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/login` | Iniciar sesión | No |

### Servicios

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/services` | Obtener todos los servicios | No |
| POST | `/api/services` | Crear servicio | Admin |
| PUT | `/api/services/:id` | Actualizar servicio | Admin |
| DELETE | `/api/services/:id` | Eliminar servicio | Admin |

### Clientes

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/clients` | Obtener todos los clientes | Admin |
| POST | `/api/clients` | Crear cliente | Admin |
| PUT | `/api/clients/:id` | Actualizar cliente | Admin |
| DELETE | `/api/clients/:id` | Eliminar cliente | Admin |

### Vehículos

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/vehicles` | Obtener todos los vehículos | Admin |
| GET | `/api/vehicles/client/:clientId` | Obtener vehículos de un cliente | Cliente/Admin |
| POST | `/api/vehicles` | Crear vehículo | Cliente/Admin |
| PUT | `/api/vehicles/:id` | Actualizar vehículo | Admin |
| DELETE | `/api/vehicles/:id` | Eliminar vehículo | Admin |

### Citas (Appointments/Bookings)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/bookings` | Obtener todas las citas | Admin/Mechanic |
| POST | `/api/bookings` | Crear cita | Cliente/Admin |
| PUT | `/api/bookings/:id` | Actualizar cita | Admin/Mechanic |
| DELETE | `/api/bookings/:id` | Eliminar cita | Admin |

### Mecánicos

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/mechanics` | Obtener todos los mecánicos con estadísticas | Admin |
| GET | `/api/mechanics/available` | Obtener mecánicos disponibles para selección | Cliente/Admin |
| GET | `/api/mechanics/profile` | Obtener perfil del mecánico logueado | Mechanic |
| POST | `/api/mechanics` | Crear mecánico | Admin |
| PUT | `/api/mechanics/:id` | Actualizar mecánico | Admin |
| PUT | `/api/mechanics/profile/update` | Actualizar perfil propio (nombre/contraseña) | Mechanic |
| POST | `/api/mechanics/regenerate-password` | Regenerar contraseña de mecánico | Admin |
| DELETE | `/api/mechanics/:id` | Eliminar mecánico | Admin |

### Facturas

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/invoices` | Obtener todas las facturas | Admin |
| POST | `/api/invoices` | Crear factura | Admin |
| POST | `/api/invoices/from-appointment/:id` | Crear factura desde cita | Admin |
| GET | `/api/invoices/:id/pdf` | Descargar PDF de factura | Admin |

### Calificaciones (Ratings)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/ratings/generate-link` | Generar link único de calificación | Admin |
| GET | `/api/ratings/token/:token` | Obtener información del token | Público |
| POST | `/api/ratings/submit` | Enviar calificación | Público |

### Reportes

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/reports` | Obtener reportes con filtros de fecha | Admin |

## 🔐 Autenticación y Roles

### Roles del Sistema

1. **Administrador (admin)**
   - Acceso completo al sistema
   - Gestión de todos los recursos
   - Generación de reportes
   - Asignación de mecánicos
   - Generación de links de calificación

2. **Mecánico (mechanic)**
   - Ver sus citas asignadas
   - Actualizar estado de citas
   - Ver su desempeño y estadísticas
   - Editar su perfil (nombre y contraseña)

3. **Cliente (client)**
   - Reservar citas
   - Ver sus propias citas
   - Ver sus vehículos (sin placa)
   - Calificar servicios (mediante link)

### Autenticación JWT

- Los tokens JWT se almacenan en `localStorage`
- Expiración: 24 horas (configurable)
- Se incluyen en el header: `Authorization: Bearer <token>`
- Las rutas protegidas verifican el token y el rol

## 👤 Funcionalidades por Rol

### 👨‍💼 Administrador

- **Dashboard completo** con KPIs y estadísticas
- **Gestión de clientes**: CRUD completo
- **Gestión de vehículos**: CRUD completo
- **Gestión de servicios**: CRUD completo
- **Gestión de citas**: Ver todas, editar estado, asignar mecánicos
- **Gestión de mecánicos**: CRUD completo, ver desempeño
- **Facturación**: Generar y descargar facturas en PDF
- **Reportes**: Generar reportes con filtros de fecha
- **Calificaciones**: Generar links de calificación para citas completadas

### 🔧 Mecánico

- **Dashboard personal**: Estadísticas individuales
- **Mis citas**: Ver todas las citas asignadas
- **Desempeño**: Ver métricas de rendimiento
- **Configuración**: Editar nombre y cambiar contraseña

### 👤 Cliente

- **Página principal**: Ver servicios disponibles
- **Reservar cita**: Proceso completo de reserva
  - Seleccionar servicio
  - Seleccionar vehículo (o crear uno nuevo)
  - Seleccionar fecha y hora
  - Seleccionar mecánico (opcional)
  - Confirmar datos
- **Calificar servicio**: Mediante link único enviado por el administrador

## ⭐ Sistema de Calificaciones

### Flujo de Calificación

1. **Administrador genera link**:
   - En la gestión de citas, para una cita completada con mecánico asignado
   - Click en botón "Calificar"
   - Se genera un token único y un link

2. **Compartir link**:
   - El administrador copia el link
   - Lo envía al cliente (por email, WhatsApp, etc.)

3. **Cliente califica**:
   - Accede al link público `/rate/:token`
   - Ve los detalles del servicio
   - Selecciona calificación (1-5 estrellas)
   - Opcionalmente deja un comentario
   - Envía la calificación

4. **Actualización automática**:
   - La calificación se guarda en la base de datos
   - El promedio del mecánico se actualiza automáticamente
   - El token se marca como usado

### Características

- **Tokens únicos**: Cada cita tiene un token único
- **Expiración**: Los tokens expiran después de 30 días
- **Una sola calificación**: Cada cita solo puede ser calificada una vez
- **Cálculo automático**: El promedio se calcula en tiempo real

## 🚀 Despliegue

### Opción 1: Despliegue Separado

#### Backend (Render, Railway, Heroku)
1. Conectar repositorio
2. Configurar variables de entorno
3. Configurar build command: `npm install`
4. Configurar start command: `npm start`
5. Configurar base de datos PostgreSQL externa

#### Frontend (Vercel, Netlify)
1. Conectar repositorio
2. Configurar build command: `npm run build`
3. Configurar output directory: `dist`
4. Configurar variables de entorno (VITE_BACKEND_URL)

### Opción 2: Docker

```dockerfile
# Dockerfile para backend
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

```dockerfile
# Dockerfile para frontend
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL

1. Verificar que PostgreSQL esté ejecutándose:
```bash
# Windows
services.msc

# Linux/Mac
sudo systemctl status postgresql
```

2. Verificar credenciales en `.env`
3. Verificar que la base de datos exista:
```sql
psql -U postgres -l
```

### Error de CORS

1. Verificar que el backend esté en el puerto 4000
2. Verificar que el frontend esté en el puerto 5173
3. Verificar configuración de CORS en `index.cjs`

### Error de autenticación

1. Verificar que el token esté en `localStorage`
2. Verificar que el token no haya expirado
3. Verificar que el JWT_SECRET esté configurado correctamente

### Error al generar link de calificación

1. Verificar que la cita esté en estado "completed"
2. Verificar que la cita tenga un mecánico asignado
3. Verificar que la cita no haya sido calificada previamente
4. Verificar que FRONTEND_URL esté configurado

### Las tablas no se crean

1. Verificar permisos del usuario de PostgreSQL
2. Verificar que la base de datos exista
3. Revisar logs del backend para errores específicos
4. Ejecutar manualmente el script de inicialización

## 📝 Notas de Desarrollo

- El sistema usa **JWT** para autenticación
- Las contraseñas se hashean con **bcryptjs** (10 rounds)
- Los PDFs se generan con **PDFKit**
- La integración con WhatsApp usa enlaces directos (`wa.me`)
- El frontend usa **Context API** para estado global
- Las notificaciones son **toast messages** no intrusivas
- Los IDs se generan con **UUID v4**

## 🔑 Usuarios por Defecto

Al inicializar la base de datos, se crean usuarios de ejemplo:

- **Administrador**:
  - Email: `admin@servicollantas.com`
  - Contraseña: `admin123`

- **Mecánico**:
  - Email: `mechanic@servicollantas.com`
  - Contraseña: `mechanic123`

> ⚠️ **Importante**: Cambiar estas contraseñas en producción.

## 📄 Licencia

Proyecto empresarial para **ServiCollantas (Serviteca Viteca)**. El uso y redistribución dependen de los acuerdos con la empresa.

## 👥 Contribuidores

- **Desarrollador Principal**: Santiago Pineda Mora
- **Cliente**: ServiCollantas

## 📞 Soporte

Para soporte técnico o consultas, contactar al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: 2024
