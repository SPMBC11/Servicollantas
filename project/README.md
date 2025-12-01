# ServiCollantas - Sistema de Gestión de Taller

Sistema completo de gestión para taller de llantas con reservas, facturación y administración.

## 🚀 Características

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Funcionalidades**:
  - Sistema de reservas de citas
  - Gestión de clientes y vehículos
  - Catálogo de servicios
  - Facturación con PDF
  - Dashboard administrativo
  - Dashboard de mecánicos
  - Integración con WhatsApp

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd project-bolt-sb1-gddud527/project
```

### 2. Configurar PostgreSQL

#### Opción A: Usando Docker (Recomendado)
```bash
# Crear y ejecutar contenedor PostgreSQL
docker run --name servicollantas-db \
  -e POSTGRES_DB=servicollantas \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

#### Opción B: Instalación local
1. Instalar PostgreSQL en tu sistema
2. Crear la base de datos:
```bash
psql -U postgres
CREATE DATABASE servicollantas;
\q
```

### 3. Instalar dependencias

#### Backend
```bash
cd src/server
npm install
```

#### Frontend
```bash
# Desde la raíz del proyecto
npm install
```

### 4. Configurar variables de entorno

Crear archivo `.env` en `src/server/`:
```env
# Configuración de la base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=servicollantas
DB_USER=postgres
DB_PASSWORD=password

# Configuración del servidor
PORT=4000
JWT_SECRET=dev-secret-servi-collantas-2025

# Configuración de WhatsApp (opcional)
WHATSAPP_PHONE=573001234567
```

### 5. Inicializar la base de datos

El servidor creará automáticamente las tablas y datos iniciales al iniciarse por primera vez.

O ejecutar manualmente:
```bash
psql -U postgres -d servicollantas -f setup-database.sql
```

## 🚀 Ejecutar la aplicación

### 1. Iniciar el backend
```bash
cd src/server
npm run dev
```

El servidor estará disponible en: http://localhost:4000

### 2. Iniciar el frontend
```bash
# Desde la raíz del proyecto
npm run dev
```

La aplicación estará disponible en: http://localhost:5173

## 👥 Usuarios por defecto

- **Administrador**: 
  - Email: admin@servicollantas.com
  - Contraseña: admin123

- **Mecánico**: 
  - Email: mechanic@servicollantas.com
  - Contraseña: mechanic123

## 📱 Funcionalidades

### Para Clientes
- Ver servicios disponibles
- Reservar citas
- Envío automático de mensaje por WhatsApp
- Seguimiento de citas

### Para Administradores
- Dashboard completo
- Gestión de clientes
- Gestión de vehículos
- Gestión de servicios
- Gestión de citas
- Facturación
- Reportes

### Para Mecánicos
- Dashboard de agenda
- Ver citas asignadas
- Actualizar estado de citas
- Perfil de mecánico

## 🗄️ Estructura de la Base de Datos

- **users**: Usuarios del sistema (admin, mechanic, client)
- **services**: Catálogo de servicios
- **clients**: Información de clientes
- **vehicles**: Vehículos de los clientes
- **appointments**: Citas/reservas
- **invoices**: Facturas generadas

## 🔧 API Endpoints

### Autenticación
- `POST /api/login` - Iniciar sesión

### Servicios
- `GET /api/services` - Obtener todos los servicios

### Clientes
- `GET /api/clients` - Obtener clientes (requiere auth)
- `POST /api/clients` - Crear cliente (requiere auth)

### Vehículos
- `GET /api/vehicles` - Obtener vehículos (requiere auth)
- `POST /api/vehicles` - Crear vehículo (requiere auth)

### Citas
- `GET /api/bookings` - Obtener citas (requiere auth)
- `POST /api/bookings` - Crear cita
- `PUT /api/bookings/:id` - Actualizar cita (requiere auth)

### Facturas
- `GET /api/invoices` - Obtener facturas (requiere auth admin)
- `POST /api/invoices` - Crear factura (requiere auth admin)
- `GET /api/invoices/:id/pdf` - Descargar PDF (requiere auth admin)

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
1. Verificar que PostgreSQL esté ejecutándose
2. Verificar las credenciales en el archivo `.env`
3. Verificar que la base de datos `servicollantas` exista

### Error de permisos
1. Verificar que el usuario de PostgreSQL tenga permisos
2. Verificar que las tablas se hayan creado correctamente

### Error de CORS
1. Verificar que el backend esté ejecutándose en el puerto 4000
2. Verificar que el frontend esté ejecutándose en el puerto 5173

## 📝 Notas de Desarrollo

- El sistema usa JWT para autenticación
- Las contraseñas se hashean con bcrypt
- Los PDFs se generan con PDFKit
- La integración con WhatsApp usa enlaces directos
- El frontend usa Context API para el estado global

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
