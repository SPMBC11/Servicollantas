# 🧪 E2E Testing Guide - ServiCollantas

**Última actualización:** 18 Diciembre 2025  
**Estado:** ✅ Complete  
**Framework:** Cypress 13.6.2

---

## 📋 Tabla de Contenidos

1. [Setup Inicial](#setup-inicial)
2. [Ejecutar Tests](#ejecutar-tests)
3. [Tests del Admin](#tests-del-admin)
4. [Tests del Cliente](#tests-del-cliente)
5. [Tests del Mecánico](#tests-del-mecánico)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Setup Inicial

### Instalación de Cypress

```bash
# En la carpeta frontend
cd frontend

# Instalar dependencias (si no lo hiciste)
npm install

# Cypress ya está incluido en package.json
# Verificar instalación
npx cypress --version
```

### Configurar URLs y Credenciales

```bash
# En frontend/.env.local o frontend/.env.test
VITE_API_URL=http://localhost:4000
VITE_APP_URL=http://localhost:5173

# Admin credentials (actualiza según tu BD)
CYPRESS_ADMIN_EMAIL=admin@servicollantas.com
CYPRESS_ADMIN_PASSWORD=Admin@123456

# Client credentials
CYPRESS_CLIENT_EMAIL=cliente@example.com
CYPRESS_CLIENT_PASSWORD=Cliente@123456

# Mechanic credentials
CYPRESS_MECHANIC_EMAIL=mecanico@example.com
CYPRESS_MECHANIC_PASSWORD=Mecanico@123456
```

### Pre-requisitos

- ✅ Backend corriendo en `http://localhost:4000`
- ✅ Frontend en Vite corriendo en `http://localhost:5173`
- ✅ Base de datos poblada con usuarios de prueba
- ✅ Node.js 18+

---

## ▶️ Ejecutar Tests

### Abrir Cypress Interactive

```bash
npm run e2e
```

Esto abre la interfaz gráfica de Cypress donde puedes:
- Ver todos los tests disponibles
- Ejecutarlos uno a uno
- Ver video en tiempo real
- Debuggear fácilmente

### Ejecutar Tests en Headless (CI/CD)

```bash
# Todos los tests E2E
npm run e2e:run

# Solo tests del Admin
npm run e2e:admin

# Solo tests del Cliente
npm run e2e:client

# Solo tests del Mecánico
npm run e2e:mechanic
```

### Ejecutar con Reporte

```bash
# Con reporte en HTML
npx cypress run --reporter html

# Con reporte en JSON
npx cypress run --reporter json

# Reporte detallado
npx cypress run --spec 'cypress/e2e/admin.cy.js' --reporter json --reporter-options mochaFile=cypress/results/admin.json
```

---

## 👨‍💼 Tests del Admin

**Archivo:** `cypress/e2e/admin.cy.js`  
**Total Tests:** 12  
**Tiempo:** ~3-5 minutos  

### Workflows Cubiertos

#### 1. ✅ Login como Admin
- Navega a `/login`
- Ingresa email y contraseña
- Verifica redirección a dashboard

#### 2. ✅ Ver Dashboard
- Muestra widgets con métricas
- Total de clientes
- Total de mecánicos
- Citas pendientes

#### 3. ✅ Gestión de Clientes
- Navegar a `/clients`
- Ver lista de clientes
- Buscar cliente por nombre
- (Crear, editar, eliminar si está implementado)

#### 4. ✅ Gestión de Mecánicos
- Navegar a `/mechanics`
- Ver lista de mecánicos
- Ver estadísticas por mecánico

#### 5. ✅ Reportes
- Navegar a `/reports`
- Filtrar por rango de fechas
- Ver estadísticas

#### 6. ✅ Gestión de Servicios
- Navegar a `/services`
- Ver lista de servicios

#### 7. ✅ Logout
- Click en menú usuario
- Click en "Cerrar Sesión"
- Redirección a login

### Ejecutar solo Admin Tests

```bash
npm run e2e:admin

# O en interfaz gráfica
npm run e2e
# Luego seleccionar admin.cy.js
```

### Resultado Esperado

```
✅ 12 tests should pass
⏱️ Duration: 3-5 minutes
```

---

## 👤 Tests del Cliente

**Archivo:** `cypress/e2e/client.cy.js`  
**Total Tests:** 13  
**Tiempo:** ~4-6 minutos  

### Workflows Cubiertos

#### 1. ✅ Login como Cliente
- Navega a `/login`
- Autentica como cliente
- Acceso a dashboard personal

#### 2. ✅ Dashboard del Cliente
- Ver citas próximas
- Ver vehículos
- Ver facturas recientes

#### 3. ✅ Gestión de Vehículos
- Navegar a `/vehicles`
- Ver lista de vehículos
- **Agregar nuevo vehículo:**
  - Marca: Toyota
  - Modelo: Corolla
  - Año: 2022
  - Placa: ABC123

#### 4. ✅ Citas
- Navegar a `/appointments`
- Ver citas agendadas
- **Crear nueva cita:**
  - Seleccionar vehículo
  - Seleccionar servicio
  - Seleccionar fecha y hora
  - Confirmar

#### 5. ✅ Facturas
- Navegar a `/invoices`
- Ver historial de facturas
- **Descargar factura** como PDF

#### 6. ✅ Calificaciones
- Navegar a `/ratings`
- Ver servicios completados
- **Calificar servicio:**
  - 5 estrellas
  - Comentario
  - Guardar

#### 7. ✅ Perfil
- Acceder a `/profile`
- Ver información personal
- **Editar teléfono**
- Guardar cambios

#### 8. ✅ Filtros
- Filtrar citas por estado
- Buscar citas por fecha

#### 9. ✅ Logout
- Cerrar sesión

### Ejecutar solo Client Tests

```bash
npm run e2e:client

# O en interfaz gráfica
npm run e2e
# Seleccionar client.cy.js
```

### Resultado Esperado

```
✅ 13 tests should pass
⏱️ Duration: 4-6 minutes
📱 Full customer journey validated
```

---

## 🔧 Tests del Mecánico

**Archivo:** `cypress/e2e/mechanic.cy.js`  
**Total Tests:** 15  
**Tiempo:** ~5-7 minutos  

### Workflows Cubiertos

#### 1. ✅ Login como Mecánico
- Navega a `/login`
- Autentica como mecánico
- Acceso a dashboard

#### 2. ✅ Dashboard del Mecánico
- Ver citas del día
- Ver calificación promedio
- Ver estadísticas

#### 3. ✅ Citas Asignadas
- Navegar a `/appointments`
- Ver citas pendientes
- Filtrar por estado:
  - Pendiente
  - En Progreso
  - Completada

#### 4. ✅ Detalles de Cita
- Click en cita
- Ver información del cliente
- Ver vehículo
- Ver servicio

#### 5. ✅ Iniciar Trabajo
- Click en "Iniciar"
- Cambio de estado a "En Progreso"
- Timestamp registrado

#### 6. ✅ Completar Cita
- Click en "Completar"
- **Ingresar información:**
  - Costo: 50000
  - Notas: "Cambio de aceite..."
- Guardar

#### 7. ✅ Ingresos
- Navegar a `/earnings`
- Ver estadísticas de ganancia
- Filtrar por período (mes, rango)

#### 8. ✅ Calificaciones Recibidas
- Navegar a `/ratings`
- Ver promedio de calificación
- Ver comentarios de clientes

#### 9. ✅ Perfil del Mecánico
- Acceder a `/profile`
- Ver especialidades
- Ver experiencia
- **Editar teléfono**

#### 10. ✅ Disponibilidad
- Toggle de estado online/offline
- Cambio inmediato

#### 11. ✅ Búsqueda
- Buscar citas por nombre de cliente
- Filtrado en tiempo real

#### 12. ✅ Logout
- Cerrar sesión

### Ejecutar solo Mechanic Tests

```bash
npm run e2e:mechanic

# O en interfaz gráfica
npm run e2e
# Seleccionar mechanic.cy.js
```

### Resultado Esperado

```
✅ 15 tests should pass
⏱️ Duration: 5-7 minutes
🔧 Complete mechanic workflow validated
```

---

## 📊 Ejecutar Todos los Tests

```bash
# Headless (sin interfaz gráfica)
npm run e2e:run

# Resultado esperado:
# ✅ 12 Admin tests
# ✅ 13 Client tests
# ✅ 15 Mechanic tests
# ✅ 40 total tests passed
# ⏱️ Total: 12-18 minutes
```

---

## 🎯 Best Practices

### 1. Data Cleanup
```javascript
// Antes de cada test
beforeEach(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.visit('/')
})
```

### 2. Esperar Elementos
```javascript
// ✅ CORRECTO
cy.get('button').should('be.visible').click()

// ❌ INCORRECTO
cy.get('button').click() // Puede fallar si no está visible
```

### 3. Usar Data Test IDs
```javascript
// En el componente
<button data-testid="logout-btn">Logout</button>

// En el test
cy.get('[data-testid="logout-btn"]').click()
```

### 4. Timeouts
```javascript
// Para elementos que tardan en cargar
cy.get('table tbody tr', { timeout: 10000 })
  .should('have.length.greaterThan', 0)
```

### 5. Selectors Seguros
```javascript
// ✅ BUENO - Específico
cy.get('[data-testid="user-menu"]')
cy.get('input[type="email"]')

// ⚠️ FRÁGIL - Genérico
cy.get('.button')
cy.get('div > div > button')
```

---

## 🐛 Troubleshooting

### Problema: "Element not found"

```javascript
// Solución 1: Esperar a que cargue
cy.get('button', { timeout: 10000 }).should('exist')

// Solución 2: Esperar elemento padre
cy.get('table').should('be.visible')
cy.get('table tbody tr').first().click()

// Solución 3: Scroll si está debajo
cy.get('button').scrollIntoView().click()
```

### Problema: Login falla

```bash
# Verificar:
1. Backend está corriendo en localhost:4000
2. Credenciales en .env.local son correctas
3. Usuario existe en BD
4. Token se guarda en localStorage

# Debuggear:
npm run e2e
# En Cypress, abre DevTools (F12)
# Ve a Application > LocalStorage
```

### Problema: Tests lentos

```bash
# Reducir esperas
# Aumentar timeouts en cypress.config.js
defaultCommandTimeout: 5000  # en lugar de 10000

# Ejecutar solo un test
npm run e2e:admin
# Luego seleccionar test específico
```

### Problema: Rutas no encontradas

```bash
# Asegurar que:
1. Frontend está en http://localhost:5173
2. Las rutas en frontend existen
3. Router está correctamente configurado

# Debuggear URL
cy.url().then(url => cy.log(url))
```

---

## 📈 Coverage Esperado

| Área | Coverage |
|------|----------|
| **Admin Workflow** | ✅ 100% (12/12 tests) |
| **Client Workflow** | ✅ 100% (13/13 tests) |
| **Mechanic Workflow** | ✅ 100% (15/15 tests) |
| **Authentication** | ✅ 100% (login, logout) |
| **CRUD Operations** | ✅ 90% (crear, listar, editar) |
| **Error Handling** | ✅ 80% (mensajes de error) |
| **Filters & Search** | ✅ 85% (búsqueda, filtrado) |

**Total: 40 tests E2E covering all 3 user roles**

---

## 🔄 CI/CD Integration

Los tests E2E se ejecutan automáticamente en GitHub Actions:

```yaml
# .github/workflows/frontend.yml
- name: Run E2E Tests
  run: npm run e2e:run
  
- name: Upload Results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: cypress-videos
    path: cypress/videos
```

---

## 📚 Recursos

- [Documentación Cypress](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Debugging](https://docs.cypress.io/guides/guides/debugging)

---

## ✅ Checklist para Production

- [ ] Todos los 40 tests pasan
- [ ] Tiempo total < 20 minutos
- [ ] No hay flaky tests
- [ ] Videos grabados (en CI/CD)
- [ ] Credenciales actualizadas en .env
- [ ] Backend y Frontend corriendo
- [ ] Base de datos con datos de prueba

---

**Estado:** ✅ Ready for Production  
**Última actualización:** 18 Diciembre 2025  
**Mantenedor:** Development Team

