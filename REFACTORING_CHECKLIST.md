# 🔧 Checklist de Refactorización - ServiCollantas

## 📋 Resumen Ejecutivo

Este documento contiene una checklist completa y ordenada de mejoras para refinar el proyecto ServiCollantas aplicando buenas prácticas, principios SOLID y arquitectura limpia. Cada punto es accionable y puede convertirse en un issue de GitHub.

**Prioridades**: 🔴 Alta | 🟡 Media | 🟢 Baja  
**Afecta**: 🔵 Backend | 🟣 Frontend | ⚪ Ambos

---

## 1. 🔵 Estandarizar CRUD del Backend (Nivel API)

### 1.1 Formato de Respuesta JSON Estándar
**Prioridad**: 🔴 Alta | **Afecta**: 🔵 Backend

- [ ] **Crear utilidad de respuesta estándar** (`backend/src/utils/response.js`)
  - Formato: `{ success: boolean, data?: any, error?: { code: string, message: string }, meta?: { timestamp, requestId } }`
  - Ejemplo:
    ```javascript
    // Success
    { success: true, data: {...}, meta: { timestamp: "2025-01-20T10:00:00Z" } }
    
    // Error
    { success: false, error: { code: "VALIDATION_ERROR", message: "Email is required" } }
    ```

- [ ] **Crear helper functions** para respuestas:
  - `successResponse(data, statusCode = 200)`
  - `errorResponse(error, statusCode = 400)`
  - `notFoundResponse(resource)`
  - `unauthorizedResponse()`
  - `forbiddenResponse()`

- [ ] **Refactorizar TODOS los endpoints** para usar el formato estándar:
  - [ ] `/api/login` - Actualmente retorna `{ token, user }`
  - [ ] `/api/services` (GET, POST, PUT, DELETE)
  - [ ] `/api/clients` (GET, POST, PUT, DELETE)
  - [ ] `/api/vehicles` (GET, POST, PUT, DELETE)
  - [ ] `/api/bookings` (GET, POST, PUT, DELETE)
  - [ ] `/api/invoices` (GET, POST, DELETE)
  - [ ] `/api/mechanics` (GET, POST, PUT, DELETE)
  - [ ] `/api/mechanics/profile` (GET)
  - [ ] `/api/mechanics/available` (GET)
  - [ ] `/api/reports` (GET)
  - [ ] `/api/ratings/*` (todos los endpoints)

**Archivos a modificar**: `backend/src/index.cjs` (37 endpoints encontrados)

---

### 1.2 Política Uniforme de Status Codes
**Prioridad**: 🔴 Alta | **Afecta**: 🔵 Backend

- [ ] **Documentar política de status codes** en `backend/docs/API_STATUS_CODES.md`:
  - `200 OK` - Operación exitosa (GET, PUT, PATCH)
  - `201 Created` - Recurso creado exitosamente (POST)
  - `204 No Content` - Operación exitosa sin contenido (DELETE)
  - `400 Bad Request` - Error de validación o datos inválidos
  - `401 Unauthorized` - Token faltante o inválido
  - `403 Forbidden` - Token válido pero sin permisos
  - `404 Not Found` - Recurso no encontrado
  - `409 Conflict` - Conflicto (ej: email duplicado)
  - `422 Unprocessable Entity` - Datos válidos pero lógica de negocio falla
  - `500 Internal Server Error` - Error del servidor
  - `503 Service Unavailable` - Servicio temporalmente no disponible

- [ ] **Crear constantes** en `backend/src/constants/httpStatus.js`:
  ```javascript
  module.exports = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  };
  ```

- [ ] **Auditar y corregir status codes** en todos los endpoints:
  - [ ] Verificar que errores de validación usen `400` o `422`
  - [ ] Verificar que errores de autenticación usen `401`
  - [ ] Verificar que errores de autorización usen `403`
  - [ ] Verificar que recursos no encontrados usen `404`
  - [ ] Verificar que conflictos (duplicados) usen `409`
  - [ ] Verificar que errores internos usen `500`

**Problemas encontrados**:
- Varios endpoints retornan `500` para errores de validación (deberían ser `400`)
- Algunos endpoints no retornan `404` cuando el recurso no existe
- Inconsistencias en manejo de duplicados (algunos `400`, otros `500`)

---

### 1.3 Centralizar Manejo de Errores
**Prioridad**: 🔴 Alta | **Afecta**: 🔵 Backend

- [ ] **Crear middleware de errores** (`backend/src/middlewares/errorHandler.js`):
  ```javascript
  function errorHandler(err, req, res, next) {
    // Log error
    // Map error types to status codes
    // Return standardized error response
  }
  ```

- [ ] **Crear clases de error personalizadas** (`backend/src/errors/`):
  - `ValidationError` - Errores de validación (400)
  - `NotFoundError` - Recurso no encontrado (404)
  - `UnauthorizedError` - No autenticado (401)
  - `ForbiddenError` - Sin permisos (403)
  - `ConflictError` - Conflicto de datos (409)
  - `DatabaseError` - Errores de BD (500)

- [ ] **Eliminar try/catch repetidos** en rutas:
  - [ ] Crear wrapper `asyncHandler(fn)` que capture errores automáticamente
  - [ ] Refactorizar todas las rutas para usar `asyncHandler`
  - [ ] Mover lógica de manejo de errores al middleware central

- [ ] **Configurar logging** (`backend/src/utils/logger.js`):
  - Usar `winston` o `pino` para logs estructurados
  - Diferentes niveles según entorno (dev vs prod)
  - No loggear información sensible en producción

**Archivos a crear**:
- `backend/src/middlewares/errorHandler.js`
- `backend/src/middlewares/asyncHandler.js`
- `backend/src/errors/AppError.js`
- `backend/src/errors/ValidationError.js`
- `backend/src/errors/NotFoundError.js`
- `backend/src/errors/UnauthorizedError.js`
- `backend/src/errors/ForbiddenError.js`
- `backend/src/errors/ConflictError.js`
- `backend/src/utils/logger.js`

**Archivos a modificar**: `backend/src/index.cjs` (eliminar ~37 bloques try/catch)

---

### 1.4 Validaciones por Entidad
**Prioridad**: 🔴 Alta | **Afecta**: 🔵 Backend

- [ ] **Instalar librería de validación**: `express-validator` o `joi`

- [ ] **Crear validadores por entidad** (`backend/src/validators/`):
  - [ ] `clientValidator.js` - Validar name, email, phone
  - [ ] `vehicleValidator.js` - Validar make, model, year, license_plate
  - [ ] `serviceValidator.js` - Validar name, description, price, duration
  - [ ] `appointmentValidator.js` - Validar client_id, vehicle_id, service_id, date, time
  - [ ] `mechanicValidator.js` - Validar name, email, phone, password
  - [ ] `invoiceValidator.js` - Validar client_name, services, total
  - [ ] `ratingValidator.js` - Validar rating (1-5), comments, token

- [ ] **Reglas de validación mínimas**:
  - **Client**: name (required, min 2 chars), email (required, valid email), phone (required, format)
  - **Vehicle**: make (required), model (required), year (required, 1900-2100), license_plate (required, unique)
  - **Service**: name (required), price (required, > 0), duration (required, > 0)
  - **Appointment**: client_id (required, UUID), vehicle_id (required, UUID), service_id (required, UUID), date (required, future), time (required, format HH:mm)
  - **Mechanic**: name (required), email (required, valid email, unique), password (required, min 6 chars)
  - **Invoice**: client_name (required), services (required, array, non-empty), total (required, > 0)
  - **Rating**: rating (required, 1-5), token (required, valid UUID)

- [ ] **Crear middleware de validación** que ejecute validadores antes de llegar al controlador

- [ ] **Aplicar validadores a todos los endpoints**:
  - [ ] POST `/api/clients` - `clientValidator.create`
  - [ ] PUT `/api/clients/:id` - `clientValidator.update`
  - [ ] POST `/api/vehicles` - `vehicleValidator.create`
  - [ ] PUT `/api/vehicles/:id` - `vehicleValidator.update`
  - [ ] POST `/api/services` - `serviceValidator.create`
  - [ ] PUT `/api/services/:id` - `serviceValidator.update`
  - [ ] POST `/api/bookings` - `appointmentValidator.create`
  - [ ] PUT `/api/bookings/:id` - `appointmentValidator.update`
  - [ ] POST `/api/mechanics` - `mechanicValidator.create`
  - [ ] PUT `/api/mechanics/:id` - `mechanicValidator.update`
  - [ ] POST `/api/invoices` - `invoiceValidator.create`
  - [ ] POST `/api/ratings/submit` - `ratingValidator.submit`

**Archivos a crear**:
- `backend/src/validators/clientValidator.js`
- `backend/src/validators/vehicleValidator.js`
- `backend/src/validators/serviceValidator.js`
- `backend/src/validators/appointmentValidator.js`
- `backend/src/validators/mechanicValidator.js`
- `backend/src/validators/invoiceValidator.js`
- `backend/src/validators/ratingValidator.js`
- `backend/src/middlewares/validate.js`

---

## 2. 🔵 Separación de Capas en el Backend (Arquitectura Limpia + SOLID)

### 2.1 Estructura de Carpetas Propuesta
**Prioridad**: 🔴 Alta | **Afecta**: 🔵 Backend

- [ ] **Crear nueva estructura de carpetas**:
  ```
  backend/src/
  ├── config/           # Configuración (ya existe config.js)
  ├── database/         # Pool de conexiones y migraciones
  ├── routes/           # Definición de rutas
  ├── controllers/      # Lógica de controladores
  ├── services/         # Lógica de negocio
  ├── repositories/     # Acceso a datos (queries)
  ├── models/           # Modelos de datos (opcional, si usas ORM)
  ├── middlewares/      # Middlewares (auth, error, validation)
  ├── validators/       # Validadores de entrada
  ├── errors/           # Clases de error personalizadas
  ├── utils/            # Utilidades (response, logger)
  ├── constants/        # Constantes (httpStatus, roles)
  └── index.cjs         # Punto de entrada (solo setup)
  ```

- [ ] **Mover archivos existentes**:
  - [ ] `config.js` → `config/index.js`
  - [ ] `database.js` → `database/connection.js` y `database/migrations.js`

---

### 2.2 Extraer Lógica de Rutas a Controladores
**Prioridad**: 🔴 Alta | **Afecta**: 🔵 Backend

- [ ] **Crear controladores por entidad** (`backend/src/controllers/`):
  - [ ] `authController.js` - login, logout
  - [ ] `clientController.js` - getAll, getById, create, update, delete
  - [ ] `vehicleController.js` - getAll, getById, getByClient, create, update, delete
  - [ ] `serviceController.js` - getAll, getById, create, update, delete
  - [ ] `appointmentController.js` - getAll, getById, create, update, delete
  - [ ] `mechanicController.js` - getAll, getById, getProfile, getAvailable, create, update, delete, updateProfile
  - [ ] `invoiceController.js` - getAll, getById, create, delete, downloadPDF
  - [ ] `ratingController.js` - generateLink, getByToken, submit
  - [ ] `reportController.js` - getReports

- [ ] **Mover lógica de negocio** de controladores a servicios:
  - Los controladores solo deben: recibir request, llamar servicio, retornar response
  - Toda la lógica de negocio va a servicios

**Archivos a crear**: 9 controladores nuevos  
**Archivos a modificar**: `backend/src/index.cjs` (extraer ~800 líneas de lógica)

---

### 2.3 Crear Servicios de Dominio (Lógica de Negocio)
**Prioridad**: 🔴 Alta | **Afecta**: 🔵 Backend

- [ ] **Crear servicios por entidad** (`backend/src/services/`):
  - [ ] `authService.js` - authenticate, generateToken, validateToken
  - [ ] `clientService.js` - findById, findAll, create, update, delete
  - [ ] `vehicleService.js` - findById, findAll, findByClient, create, update, delete
  - [ ] `serviceService.js` - findById, findAll, create, update, delete
  - [ ] `appointmentService.js` - findById, findAll, findByMechanic, create, update, delete, updateStatus
  - [ ] `mechanicService.js` - findById, findAll, findAvailable, getProfile, create, update, delete, updateProfile
  - [ ] `invoiceService.js` - findById, findAll, create, delete, generatePDF
  - [ ] `ratingService.js` - generateToken, validateToken, submit, getByAppointment
  - [ ] `reportService.js` - generateReport, getStatistics

- [ ] **Definir interfaces/contratos** (documentación o TypeScript):
  ```javascript
  // Ejemplo: IClientService
  interface IClientService {
    findById(id: string): Promise<Client>;
    findAll(): Promise<Client[]>;
    create(data: CreateClientDTO): Promise<Client>;
    update(id: string, data: UpdateClientDTO): Promise<Client>;
    delete(id: string): Promise<void>;
  }
  ```

- [ ] **Inyección de dependencias**:
  - [ ] Crear `backend/src/container.js` o usar patrón factory
  - [ ] Inyectar repositorios en servicios
  - [ ] Inyectar servicios en controladores
  - [ ] Evitar `require()` directo, usar inyección

**Archivos a crear**: 9 servicios nuevos  
**Lógica a mover**: ~600 líneas de `index.cjs` a servicios

---

### 2.4 Crear Repositorios (Acceso a Datos)
**Prioridad**: 🟡 Media | **Afecta**: 🔵 Backend

- [ ] **Crear repositorios por entidad** (`backend/src/repositories/`):
  - [ ] `clientRepository.js` - Todas las queries SQL de clients
  - [ ] `vehicleRepository.js` - Todas las queries SQL de vehicles
  - [ ] `serviceRepository.js` - Todas las queries SQL de services
  - [ ] `appointmentRepository.js` - Todas las queries SQL de appointments
  - [ ] `mechanicRepository.js` - Todas las queries SQL de mechanics (users con role='mechanic')
  - [ ] `invoiceRepository.js` - Todas las queries SQL de invoices
  - [ ] `ratingRepository.js` - Todas las queries SQL de ratings y rating_tokens
  - [ ] `userRepository.js` - Queries de usuarios (login, etc.)

- [ ] **Abstraer acceso a base de datos**:
  - Los servicios NO deben tener queries SQL directas
  - Los repositorios encapsulan todas las queries
  - Facilita cambio de BD en el futuro

**Archivos a crear**: 8 repositorios nuevos  
**Queries a mover**: ~200 líneas de SQL de `index.cjs` a repositorios

---

### 2.5 Dividir Funciones "Dios" (Demasiado Grandes)
**Prioridad**: 🟡 Media | **Afecta**: 🔵 Backend

**Funciones identificadas que necesitan refactor**:

- [ ] **`POST /api/bookings`** (~60 líneas):
  - [ ] Extraer validación de cliente a `clientService.ensureExists()`
  - [ ] Extraer validación de mecánico a `mechanicService.validateExists()`
  - [ ] Simplificar lógica de creación

- [ ] **`GET /api/mechanics/profile`** (~80 líneas):
  - [ ] Extraer cálculo de estadísticas a `mechanicService.calculateStats()`
  - [ ] Extraer obtención de citas a `appointmentService.findByMechanic()`
  - [ ] Extraer cálculo de rating a `ratingService.getAverageByMechanic()`

- [ ] **`GET /api/reports`** (~80 líneas):
  - [ ] Extraer cada query a métodos separados en `reportRepository`
  - [ ] Mover lógica de agregación a `reportService.aggregateData()`

- [ ] **`PUT /api/bookings/:id`** (~50 líneas):
  - [ ] Extraer construcción de query dinámica a `appointmentRepository.buildUpdateQuery()`
  - [ ] Simplificar lógica de actualización

**Criterio**: Funciones > 40 líneas deben dividirse

---

## 3. ⚪ CRUD por Rol (Admin, Mecánico, Cliente) Bien Definidos

### 3.1 Matriz de Permisos por Operación
**Prioridad**: 🔴 Alta | **Afecta**: ⚪ Ambos

- [ ] **Crear documento de permisos** (`backend/docs/PERMISSIONS_MATRIX.md`):

| Entidad | Operación | Admin | Mechanic | Client | Público |
|---------|-----------|-------|----------|--------|---------|
| **Clients** | GET (all) | ✅ | ✅ | ❌ | ❌ |
| | GET (by id) | ✅ | ✅ | ✅ (solo propio) | ❌ |
| | POST | ✅ | ✅ | ❌ | ❌ |
| | PUT | ✅ | ✅ | ✅ (solo propio) | ❌ |
| | DELETE | ✅ | ❌ | ❌ | ❌ |
| **Vehicles** | GET (all) | ✅ | ✅ | ❌ | ❌ |
| | GET (by id) | ✅ | ✅ | ✅ (solo propios) | ❌ |
| | GET (by client) | ✅ | ✅ | ✅ (solo propios) | ❌ |
| | POST | ✅ | ✅ | ✅ (solo propios) | ❌ |
| | PUT | ✅ | ✅ | ✅ (solo propios) | ❌ |
| | DELETE | ✅ | ❌ | ✅ (solo propios) | ❌ |
| **Services** | GET (all) | ✅ | ✅ | ✅ | ✅ |
| | POST | ✅ | ❌ | ❌ | ❌ |
| | PUT | ✅ | ❌ | ❌ | ❌ |
| | DELETE | ✅ | ❌ | ❌ | ❌ |
| **Appointments** | GET (all) | ✅ | ✅ (solo propias) | ✅ (solo propias) | ❌ |
| | GET (by id) | ✅ | ✅ (solo propia) | ✅ (solo propia) | ❌ |
| | POST | ✅ | ✅ | ✅ | ❌ |
| | PUT | ✅ | ✅ (solo propias) | ❌ | ❌ |
| | DELETE | ✅ | ❌ | ✅ (solo propias) | ❌ |
| **Mechanics** | GET (all) | ✅ | ❌ | ✅ (solo disponibles) | ❌ |
| | GET (profile) | ❌ | ✅ (solo propio) | ❌ | ❌ |
| | POST | ✅ | ❌ | ❌ | ❌ |
| | PUT | ✅ | ✅ (solo propio) | ❌ | ❌ |
| | DELETE | ✅ | ❌ | ❌ | ❌ |
| **Invoices** | GET (all) | ✅ | ❌ | ❌ | ❌ |
| | GET (by id) | ✅ | ❌ | ✅ (solo propia) | ❌ |
| | POST | ✅ | ❌ | ❌ | ❌ |
| | DELETE | ✅ | ❌ | ❌ | ❌ |
| **Ratings** | POST (submit) | ❌ | ❌ | ❌ | ✅ (con token) |
| | GET (token info) | ❌ | ❌ | ❌ | ✅ (con token) |
| | POST (generate link) | ✅ | ❌ | ❌ | ❌ |
| **Reports** | GET | ✅ | ❌ | ❌ | ❌ |

---

### 3.2 Detectar Inconsistencias de Seguridad
**Prioridad**: 🔴 Alta | **Afecta**: 🔵 Backend

**Problemas encontrados**:

- [ ] **`GET /api/clients`** - Actualmente permite `admin` y `mechanic`, pero debería verificar permisos
- [ ] **`GET /api/vehicles`** - Permite a `mechanic` ver todos los vehículos (¿debería ser solo los de sus citas?)
- [ ] **`POST /api/vehicles`** - Permite a cualquier rol autenticado crear vehículos (verificar lógica de `client_id`)
- [ ] **`PUT /api/clients/:id`** - No verifica que el cliente solo pueda editar su propio perfil
- [ ] **`PUT /api/vehicles/:id`** - No verifica que el cliente solo pueda editar sus propios vehículos
- [ ] **`GET /api/bookings`** - Mecánico puede ver todas las citas (debería filtrar por `service_provider_id`)
- [ ] **`PUT /api/bookings/:id`** - Mecánico puede editar cualquier cita (debería solo las asignadas)
- [ ] **`GET /api/invoices`** - Solo admin puede ver todas, pero cliente debería poder ver las suyas
- [ ] **`POST /api/invoices`** - Solo admin puede crear, pero ¿mecánico también debería?

- [ ] **Crear middleware de autorización** (`backend/src/middlewares/authorize.js`):
  ```javascript
  function authorize(permission) {
    return (req, res, next) => {
      // Verificar si el usuario tiene el permiso
      // Verificar ownership (si aplica)
    };
  }
  ```

- [ ] **Crear helper de ownership** (`backend/src/utils/ownership.js`):
  - `checkClientOwnership(req, clientId)`
  - `checkVehicleOwnership(req, vehicleId)`
  - `checkAppointmentOwnership(req, appointmentId)`
  - `checkMechanicAssignment(req, appointmentId)`

- [ ] **Aplicar verificaciones de ownership** en todos los endpoints que lo requieran

---

### 3.3 Mejorar Middlewares de Autenticación/Autorización
**Prioridad**: 🔴 Alta | **Afecta**: 🔵 Backend

- [ ] **Refactorizar `authMiddleware`** (`backend/src/middlewares/auth.js`):
  - [ ] Separar en dos middlewares: `authenticate` y `authorize`
  - [ ] `authenticate` - Solo verifica token, agrega `req.user`
  - [ ] `authorize(roles)` - Verifica roles específicos

- [ ] **Crear middleware de ownership** (`backend/src/middlewares/ownership.js`):
  - Verificar que el usuario es dueño del recurso o tiene permisos de admin

- [ ] **Crear helper de permisos** (`backend/src/utils/permissions.js`):
  - `hasRole(user, role)`
  - `hasAnyRole(user, roles)`
  - `canAccessResource(user, resource, action)`

- [ ] **Aplicar middlewares de forma consistente**:
  ```javascript
  // Ejemplo
  router.get('/clients/:id', 
    authenticate, 
    authorize(['admin', 'mechanic', 'client']),
    checkOwnership('client'),
    clientController.getById
  );
  ```

---

## 4. 🟣 Frontend: Componentes y Hooks Respetando SOLID

### 4.1 Detectar Componentes con Demasiadas Responsabilidades
**Prioridad**: 🔴 Alta | **Afecta**: 🟣 Frontend

**Componentes identificados que necesitan refactor**:

- [ ] **`AdminDashboard.tsx`** (~380 líneas):
  - [ ] Extraer `KPICards` a componente separado
  - [ ] Extraer `MechanicPerformance` a componente separado
  - [ ] Extraer `RecentActivity` a componente separado
  - [ ] Extraer lógica de estado a hook `useAdminDashboard()`

- [ ] **`MechanicDashboard.tsx`** (~637 líneas):
  - [ ] Extraer `StatsCards` a componente separado
  - [ ] Extraer `AppointmentsList` a componente separado
  - [ ] Extraer `SettingsForm` a componente separado
  - [ ] Extraer lógica de estado a hook `useMechanicDashboard()`

- [ ] **`ManageAppointments.tsx`** (revisar tamaño):
  - [ ] Extraer `AppointmentTable` a componente separado
  - [ ] Extraer `AppointmentFilters` a componente separado
  - [ ] Extraer `AssignMechanicModal` a componente separado
  - [ ] Extraer `GenerateRatingLinkModal` a componente separado

- [ ] **`ManageClients.tsx`** (revisar tamaño):
  - [ ] Extraer `ClientTable` a componente separado
  - [ ] Extraer `ClientForm` a componente separado
  - [ ] Extraer `ClientFilters` a componente separado

- [ ] **`BookingModal.tsx`** (revisar tamaño):
  - [ ] Extraer cada step a componente separado
  - [ ] Extraer lógica de navegación a hook `useBookingSteps()`

**Criterio**: Componentes > 300 líneas deben dividirse

---

### 4.2 Separar Componentes Contenedores de Presentación
**Prioridad**: 🔴 Alta | **Afecta**: 🟣 Frontend

- [ ] **Crear carpeta de componentes de presentación** (`frontend/src/components/presentational/`):
  - Componentes que solo reciben props y renderizan
  - No tienen estado ni llamadas a API
  - Ejemplos: `ClientCard`, `VehicleCard`, `ServiceCard`, `AppointmentRow`

- [ ] **Crear carpeta de componentes contenedores** (`frontend/src/components/containers/`):
  - Componentes que manejan estado y llamadas a API
  - Ejemplos: `ClientListContainer`, `AppointmentListContainer`

- [ ] **Refactorizar componentes existentes**:
  - [ ] `AdminDashboard` → `AdminDashboardContainer` + `KPICard`, `MechanicPerformanceCard`, etc.
  - [ ] `MechanicDashboard` → `MechanicDashboardContainer` + `StatsCard`, `AppointmentCard`, etc.
  - [ ] `ManageClients` → `ClientListContainer` + `ClientTable`, `ClientForm`, `ClientRow`
  - [ ] `ManageAppointments` → `AppointmentListContainer` + `AppointmentTable`, `AppointmentRow`, `AppointmentFilters`

**Estructura propuesta**:
```
components/
├── admin/
│   ├── AdminDashboardContainer.tsx  # Contenedor
│   ├── KPICard.tsx                  # Presentacional
│   ├── MechanicPerformanceCard.tsx  # Presentacional
│   └── ...
├── presentational/
│   ├── ClientCard.tsx
│   ├── VehicleCard.tsx
│   └── ...
└── containers/
    ├── ClientListContainer.tsx
    └── ...
```

---

### 4.3 Crear Hooks Personalizados por Dominio
**Prioridad**: 🟡 Media | **Afecta**: 🟣 Frontend

- [ ] **Crear carpeta de hooks** (`frontend/src/hooks/`):
  - [ ] `useClients.ts` - `useClients()`, `useClient(id)`, `useCreateClient()`, `useUpdateClient()`, `useDeleteClient()`
  - [ ] `useVehicles.ts` - `useVehicles()`, `useVehicle(id)`, `useVehiclesByClient(clientId)`, `useCreateVehicle()`, `useUpdateVehicle()`, `useDeleteVehicle()`
  - [ ] `useServices.ts` - `useServices()`, `useService(id)`, `useCreateService()`, `useUpdateService()`, `useDeleteService()`
  - [ ] `useAppointments.ts` - `useAppointments()`, `useAppointment(id)`, `useAppointmentsByMechanic()`, `useCreateAppointment()`, `useUpdateAppointment()`, `useDeleteAppointment()`
  - [ ] `useMechanics.ts` - `useMechanics()`, `useMechanic(id)`, `useAvailableMechanics()`, `useMechanicProfile()`, `useCreateMechanic()`, `useUpdateMechanic()`
  - [ ] `useInvoices.ts` - `useInvoices()`, `useInvoice(id)`, `useCreateInvoice()`, `useDeleteInvoice()`, `useDownloadInvoicePDF(id)`
  - [ ] `useRatings.ts` - `useGenerateRatingLink()`, `useSubmitRating()`, `useRatingByToken(token)`
  - [ ] `useReports.ts` - `useReports(startDate, endDate)`
  - [ ] `useAdminDashboard.ts` - Lógica específica del dashboard de admin
  - [ ] `useMechanicDashboard.ts` - Lógica específica del dashboard de mecánico

- [ ] **Cada hook debe**:
  - Manejar estado de loading, error, data
  - Usar `useState` y `useEffect` internamente
  - Retornar `{ data, loading, error, refetch, ...actions }`
  - Usar los servicios de `api.ts`

**Ejemplo**:
```typescript
// hooks/useClients.ts
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { clients, loading, error, refetch: fetchClients };
}
```

---

### 4.4 Centralizar Llamadas HTTP en Capa de Services
**Prioridad**: 🟡 Media | **Afecta**: 🟣 Frontend

- [ ] **Revisar `api.ts` actual**:
  - ✅ Ya existe estructura de servicios
  - ⚠️ Algunos componentes hacen `fetch` directo (buscar y eliminar)

- [ ] **Buscar llamadas `fetch` directas** en componentes:
  ```bash
  grep -r "fetch(" frontend/src/components/
  ```

- [ ] **Reemplazar todas las llamadas directas** por servicios de `api.ts`

- [ ] **Mejorar `api.ts`**:
  - [ ] Agregar tipos TypeScript para todas las respuestas
  - [ ] Agregar manejo de errores más robusto
  - [ ] Agregar interceptors (si se migra a axios)
  - [ ] Agregar retry logic para requests fallidos

- [ ] **Considerar migrar a `axios`** (opcional pero recomendado):
  - Mejor manejo de errores
  - Interceptors
  - Timeout automático
  - Cancelación de requests

---

## 5. 🟣 UX de CRUD en Frontend (Admin, Mecánico, Cliente)

### 5.1 Unificar Estados de Carga, Éxito y Error
**Prioridad**: 🔴 Alta | **Afecta**: 🟣 Frontend

- [ ] **Crear componentes reutilizables de estado**:
  - [ ] `LoadingSpinner.tsx` - Ya existe, verificar uso consistente
  - [ ] `ErrorMessage.tsx` - Componente para mostrar errores
  - [ ] `EmptyState.tsx` - Componente para estados vacíos
  - [ ] `SuccessMessage.tsx` - Componente para mensajes de éxito

- [ ] **Crear hook `useAsyncOperation`**:
  ```typescript
  function useAsyncOperation<T>(
    operation: () => Promise<T>
  ): {
    execute: () => Promise<void>;
    loading: boolean;
    error: Error | null;
    success: boolean;
  }
  ```

- [ ] **Auditar todas las vistas CRUD** y unificar:
  - [ ] `ManageClients` - Verificar spinners, toasts, mensajes de error
  - [ ] `ManageVehicles` - Verificar spinners, toasts, mensajes de error
  - [ ] `ManageServices` - Verificar spinners, toasts, mensajes de error
  - [ ] `ManageAppointments` - Verificar spinners, toasts, mensajes de error
  - [ ] `ManageMechanics` - Verificar spinners, toasts, mensajes de error
  - [ ] `ManageInvoices` - Verificar spinners, toasts, mensajes de error
  - [ ] `MyAppointments` (cliente) - Verificar spinners, toasts, mensajes de error
  - [ ] `MyVehicles` (cliente) - Verificar spinners, toasts, mensajes de error
  - [ ] `MechanicDashboard` - Verificar spinners, toasts, mensajes de error

- [ ] **Establecer estándar de UX**:
  - Loading: Spinner centrado o skeleton loader
  - Error: Toast notification + mensaje debajo del input (si es error de validación)
  - Éxito: Toast notification verde
  - Vacío: Mensaje amigable con icono

---

### 5.2 Esquema de Validación Reutilizable para Formularios
**Prioridad**: 🟡 Media | **Afecta**: 🟣 Frontend

- [ ] **Instalar librería de validación**: `react-hook-form` + `yup` o `zod`

- [ ] **Crear schemas de validación** (`frontend/src/validators/`):
  - [ ] `clientSchema.ts` - Validación de formulario de cliente
  - [ ] `vehicleSchema.ts` - Validación de formulario de vehículo
  - [ ] `serviceSchema.ts` - Validación de formulario de servicio
  - [ ] `appointmentSchema.ts` - Validación de formulario de cita
  - [ ] `mechanicSchema.ts` - Validación de formulario de mecánico
  - [ ] `invoiceSchema.ts` - Validación de formulario de factura
  - [ ] `ratingSchema.ts` - Validación de formulario de calificación

- [ ] **Crear componente `FormField` reutilizable**:
  - Maneja label, input, error message
  - Integrado con `react-hook-form`

- [ ] **Crear hook `useFormValidation`**:
  - Wrapper alrededor de `react-hook-form`
  - Maneja submit, errors, loading

- [ ] **Refactorizar todos los formularios** para usar el nuevo sistema:
  - [ ] Formulario de cliente (crear/editar)
  - [ ] Formulario de vehículo (crear/editar)
  - [ ] Formulario de servicio (crear/editar)
  - [ ] Formulario de cita (crear/editar)
  - [ ] Formulario de mecánico (crear/editar)
  - [ ] Formulario de factura (crear)
  - [ ] Formulario de calificación
  - [ ] Formulario de configuración de mecánico

---

### 5.3 Mapear Mensajes de Error del Backend a la UI
**Prioridad**: 🟡 Media | **Afecta**: 🟣 Frontend

- [ ] **Crear utilidad de mapeo de errores** (`frontend/src/utils/errorMapper.ts`):
  ```typescript
  function mapBackendErrorToUI(error: BackendError): {
    field?: string;
    message: string;
    type: 'validation' | 'server' | 'network' | 'auth';
  }
  ```

- [ ] **Mapear códigos de error del backend**:
  - `VALIDATION_ERROR` → Mostrar debajo del campo correspondiente
  - `NOT_FOUND` → Mensaje amigable "Recurso no encontrado"
  - `UNAUTHORIZED` → Redirigir a login
  - `FORBIDDEN` → Mensaje "No tienes permisos"
  - `CONFLICT` → Mensaje específico según el conflicto (ej: "Email ya existe")
  - `INTERNAL_SERVER_ERROR` → Mensaje genérico "Error del servidor"

- [ ] **Auditar pantallas que no muestran errores bien**:
  - [ ] Verificar que todos los formularios muestren errores de validación
  - [ ] Verificar que errores de red se muestren claramente
  - [ ] Verificar que errores 401 redirijan a login
  - [ ] Verificar que errores 403 muestren mensaje apropiado

---

## 6. 🟣 Refactor de Vistas Críticas (Dashboards y "Mis Citas")

### 6.1 Dividir Dashboard Administrativo
**Prioridad**: 🟡 Media | **Afecta**: 🟣 Frontend

- [ ] **Extraer componentes del `AdminDashboard`**:
  - [ ] `KPICard.tsx` - Tarjeta de KPI individual (total citas, completadas, etc.)
  - [ ] `KPIGrid.tsx` - Grid de tarjetas KPI
  - [ ] `MechanicPerformanceCard.tsx` - Tarjeta de desempeño de mecánico
  - [ ] `MechanicPerformanceList.tsx` - Lista de top 5 mecánicos
  - [ ] `RecentAppointmentsTable.tsx` - Tabla de citas recientes
  - [ ] `RevenueChart.tsx` - Gráfico de ingresos (si existe)
  - [ ] `ActivityTimeline.tsx` - Timeline de actividad reciente

- [ ] **Crear hook `useAdminDashboard`**:
  - Maneja fetching de datos
  - Calcula estadísticas
  - Retorna `{ kpis, mechanics, recentAppointments, loading, error }`

- [ ] **Estructura final**:
  ```tsx
  <AdminDashboardContainer>
    <KPIGrid kpis={kpis} />
    <MechanicPerformanceList mechanics={mechanics} />
    <RecentAppointmentsTable appointments={recentAppointments} />
  </AdminDashboardContainer>
  ```

---

### 6.2 Dividir Dashboard de Mecánico
**Prioridad**: 🟡 Media | **Afecta**: 🟣 Frontend

- [ ] **Extraer componentes del `MechanicDashboard`**:
  - [ ] `StatCard.tsx` - Tarjeta de estadística individual
  - [ ] `StatsGrid.tsx` - Grid de estadísticas
  - [ ] `AppointmentsList.tsx` - Lista de citas
  - [ ] `AppointmentCard.tsx` - Tarjeta de cita individual
  - [ ] `AppointmentFilters.tsx` - Filtros de citas (por estado, fecha)
  - [ ] `SettingsForm.tsx` - Formulario de configuración
  - [ ] `ProfileSection.tsx` - Sección de perfil

- [ ] **Crear hook `useMechanicDashboard`**:
  - Maneja fetching de datos del perfil
  - Calcula estadísticas
  - Maneja actualización de perfil
  - Retorna `{ stats, appointments, loading, error, updateProfile }`

- [ ] **Estructura final**:
  ```tsx
  <MechanicDashboardContainer>
    <StatsGrid stats={stats} />
    <AppointmentsList 
      appointments={appointments} 
      filters={filters}
      onFilterChange={handleFilterChange}
    />
    <SettingsForm onUpdate={updateProfile} />
  </MechanicDashboardContainer>
  ```

---

### 6.3 Refactorizar "Mis Citas" (Cliente y Mecánico)
**Prioridad**: 🟡 Media | **Afecta**: 🟣 Frontend

- [ ] **Componentes reutilizables para citas**:
  - [ ] `AppointmentCard.tsx` - Tarjeta de cita (usado en múltiples lugares)
  - [ ] `AppointmentStatusBadge.tsx` - Badge de estado
  - [ ] `AppointmentActions.tsx` - Botones de acción (cancelar, ver detalles)
  - [ ] `AppointmentFilters.tsx` - Filtros (estado, fecha, servicio)
  - [ ] `AppointmentDetailsModal.tsx` - Modal de detalles

- [ ] **Crear hook `useAppointments`**:
  - `useAppointments(filters)` - Obtener citas con filtros
  - `useAppointmentActions()` - Acciones (cancelar, completar, etc.)

- [ ] **Refactorizar**:
  - [ ] `MyAppointments.tsx` (cliente) - Usar componentes reutilizables
  - [ ] `MechanicAgenda.tsx` - Usar componentes reutilizables
  - [ ] `ManageAppointments.tsx` (admin) - Usar componentes reutilizables

---

### 6.4 Reutilizar Componentes Entre Dashboards
**Prioridad**: 🟢 Baja | **Afecta**: 🟣 Frontend

- [ ] **Identificar componentes comunes**:
  - [ ] `Card` - Ya existe, verificar uso consistente
  - [ ] `StatCard` - Usado en ambos dashboards
  - [ ] `AppointmentCard` - Usado en múltiples lugares
  - [ ] `LoadingSpinner` - Ya existe
  - [ ] `EmptyState` - Crear si no existe

- [ ] **Mover componentes comunes** a `components/ui/` o `components/shared/`

- [ ] **Documentar componentes compartidos** en `frontend/docs/COMPONENTS.md`

---

## 7. ⚪ Mejoras de Arquitectura General y Mantenibilidad

### 7.1 Estructura Final de Carpetas
**Prioridad**: 🟡 Media | **Afecta**: ⚪ Ambos

- [ ] **Backend - Estructura propuesta**:
  ```
  backend/
  ├── src/
  │   ├── config/          # Configuración
  │   ├── database/        # Conexión y migraciones
  │   ├── routes/          # Definición de rutas
  │   ├── controllers/     # Controladores
  │   ├── services/        # Lógica de negocio
  │   ├── repositories/    # Acceso a datos
  │   ├── middlewares/     # Middlewares
  │   ├── validators/      # Validadores
  │   ├── errors/          # Clases de error
  │   ├── utils/           # Utilidades
  │   ├── constants/       # Constantes
  │   └── index.cjs        # Punto de entrada
  ├── tests/               # Tests
  ├── docs/                # Documentación
  └── package.json
  ```

- [ ] **Frontend - Estructura propuesta**:
  ```
  frontend/
  ├── src/
  │   ├── components/
  │   │   ├── admin/       # Componentes específicos de admin
  │   │   ├── mechanic/    # Componentes específicos de mecánico
  │   │   ├── client/      # Componentes específicos de cliente
  │   │   ├── public/      # Componentes públicos
  │   │   ├── ui/          # Componentes UI reutilizables
  │   │   ├── presentational/  # Componentes de presentación
  │   │   └── containers/  # Componentes contenedores
  │   ├── hooks/           # Hooks personalizados
  │   ├── services/        # Servicios API
  │   ├── context/         # Context API
  │   ├── utils/           # Utilidades
  │   ├── validators/      # Validadores de formularios
  │   ├── types/           # Tipos TypeScript
  │   └── ...
  ├── tests/               # Tests
  └── package.json
  ```

- [ ] **Migrar archivos** a la nueva estructura (gradualmente)

---

### 7.2 Aislar Configuración
**Prioridad**: 🟡 Media | **Afecta**: ⚪ Ambos

- [ ] **Backend - Configuración centralizada**:
  - [ ] `backend/src/config/index.js` - Ya existe, mejorar
  - [ ] `backend/src/config/database.js` - Configuración de BD
  - [ ] `backend/src/config/server.js` - Configuración del servidor
  - [ ] `backend/src/config/jwt.js` - Configuración de JWT
  - [ ] `backend/src/constants/roles.js` - Roles del sistema
  - [ ] `backend/src/constants/permissions.js` - Permisos
  - [ ] `backend/src/constants/httpStatus.js` - Status codes

- [ ] **Frontend - Configuración centralizada**:
  - [ ] `frontend/src/config/api.ts` - URLs de API
  - [ ] `frontend/src/config/routes.ts` - Rutas de la aplicación
  - [ ] `frontend/src/config/constants.ts` - Constantes (roles, estados, etc.)
  - [ ] `frontend/src/config/validation.ts` - Reglas de validación compartidas

---

### 7.3 Patrones para Reportes y Facturación
**Prioridad**: 🟢 Baja | **Afecta**: 🔵 Backend

- [ ] **Crear servicio de generación de PDFs** (`backend/src/services/pdfService.js`):
  - [ ] `generateInvoicePDF(invoiceData)` - Generar PDF de factura
  - [ ] `generateReportPDF(reportData)` - Generar PDF de reporte
  - [ ] Usar `pdfkit` (ya instalado) o considerar `puppeteer` para HTML→PDF

- [ ] **Crear servicio de formateo de datos** (`backend/src/services/formatService.js`):
  - [ ] `formatCurrency(amount)` - Formatear moneda
  - [ ] `formatDate(date)` - Formatear fecha
  - [ ] `formatPhone(phone)` - Formatear teléfono
  - [ ] `formatLicensePlate(plate)` - Formatear placa

- [ ] **Mover lógica de PDFs** de controladores a servicios:
  - [ ] `invoiceController.downloadPDF` → `pdfService.generateInvoicePDF`
  - [ ] Lógica de formateo → `formatService`

- [ ] **Crear templates de PDF** (`backend/src/templates/`):
  - [ ] `invoiceTemplate.js` - Template de factura
  - [ ] `reportTemplate.js` - Template de reporte

---

### 7.4 Lista de Pruebas Mínimas Recomendadas
**Prioridad**: 🟡 Media | **Afecta**: ⚪ Ambos

- [ ] **Backend - Tests unitarios** (`backend/tests/unit/`):
  - [ ] Tests de servicios (lógica de negocio)
  - [ ] Tests de repositorios (queries)
  - [ ] Tests de validadores
  - [ ] Tests de utilidades (response, logger, etc.)

- [ ] **Backend - Tests de integración** (`backend/tests/integration/`):
  - [ ] Tests de endpoints (usar `supertest`)
  - [ ] Tests de autenticación/autorización
  - [ ] Tests de flujos completos (crear cita, generar factura, etc.)

- [ ] **Frontend - Tests unitarios** (`frontend/tests/unit/`):
  - [ ] Tests de hooks personalizados
  - [ ] Tests de utilidades
  - [ ] Tests de componentes de presentación (con `@testing-library/react`)

- [ ] **Frontend - Tests de integración** (`frontend/tests/integration/`):
  - [ ] Tests de flujos de usuario (con `@testing-library/react` y `MSW` para mock de API)
  - [ ] Tests de formularios

- [ ] **Configurar herramientas de testing**:
  - [ ] Backend: `jest` + `supertest`
  - [ ] Frontend: `vitest` (ya viene con Vite) + `@testing-library/react` + `MSW`

- [ ] **Tests críticos a implementar primero**:
  - [ ] Login (backend + frontend)
  - [ ] Crear cita (backend + frontend)
  - [ ] Generar factura (backend)
  - [ ] Calificar mecánico (backend + frontend)
  - [ ] Autorización por roles (backend)

---

## 📊 Resumen de Prioridades

### 🔴 Alta Prioridad (Hacer Primero)
1. Estandarizar formato de respuestas API
2. Centralizar manejo de errores
3. Crear validaciones por entidad
4. Separar controladores y servicios
5. Definir y aplicar matriz de permisos
6. Detectar y corregir inconsistencias de seguridad
7. Dividir componentes grandes del frontend
8. Unificar estados de carga/error/éxito

### 🟡 Media Prioridad (Hacer Después)
1. Crear repositorios (abstracción de datos)
2. Dividir funciones "Dios"
3. Crear hooks personalizados
4. Esquema de validación reutilizable
5. Mapear errores del backend a UI
6. Refactorizar dashboards
7. Estructura final de carpetas
8. Aislar configuración
9. Tests mínimos

### 🟢 Baja Prioridad (Mejoras Continuas)
1. Reutilizar componentes entre dashboards
2. Patrones para reportes y facturación
3. Optimizaciones de performance
4. Mejoras de UX menores

---

## 📝 Notas de Implementación

- **Enfoque incremental**: No intentar hacer todo de una vez. Priorizar por impacto y riesgo.
- **Mantener funcionalidad**: Cada refactor debe mantener la funcionalidad existente.
- **Tests primero**: Para refactors grandes, escribir tests primero (TDD).
- **Commits pequeños**: Hacer commits frecuentes y pequeños para facilitar rollback.
- **Documentar cambios**: Actualizar README y documentación cuando se hagan cambios arquitectónicos.

---

**Total de tareas**: ~150+ items accionables  
**Tiempo estimado**: 4-6 semanas de trabajo a tiempo completo  
**Recomendación**: Priorizar las tareas marcadas con 🔴 Alta y trabajar en sprints de 1-2 semanas

