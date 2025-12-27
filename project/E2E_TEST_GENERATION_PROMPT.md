# 📋 Prompt para Generar Tests E2E Correctamente

## 🎯 Versión Cypress (Lo que usamos en ServiCollantas)

```
Genera una suite de tests E2E en Cypress para mi aplicación React/TypeScript.
La prueba debe:

1. CONFIGURACIÓN BASE
   - Usar Cypress 13.x con la configuración en cypress.config.js
   - Configurar baseUrl como http://localhost:5173 (frontend)
   - Backend API en http://localhost:4000
   - Database: PostgreSQL con tablas pre-populadas

2. ESTRUCTURA Y PATRONES
   - Usar el patrón Arrange-Act-Assert:
     * Arrange: cy.visit(), cy.get()
     * Act: cy.type(), cy.click()
     * Assert: cy.contains(), cy.url()
   - Crear comandos reutilizables en support/commands.js
   - Agrupar tests con describe() y usar it() para casos específicos

3. ESPERAS Y SINCRONIZACIÓN (CRÍTICO)
   - Usar cy.wait() mínimo 2-3 segundos después de login para redirecciones
   - Esperar elementos antes de interactuar: cy.get('selector', { timeout: 10000 })
   - Nunca confíes en tiempos exactos, usa cy.contains() que espera automáticamente
   - Para elementos que cargan datos: cy.get('selector').should('be.visible')

4. SELECTORES (PREFERENCIAS)
   - Prioridad 1: cy.get('input[type="email"]') - Por tipo de input
   - Prioridad 2: cy.get('[data-testid="login-btn"]') - Data attributes
   - Prioridad 3: cy.get('button').contains('Login') - Por contenido
   - Evitar: cy.get('.class-random-1234') - Classes que cambian

5. MANEJO DE AUTENTICACIÓN
   - Crear comando cy.login(email, password) que:
     * Visite la página de login
     * Llene email y password
     * Haga click en submit
     * ESPERE 2.5 segundos para que se procese el login y redirija
     * Verifique que la URL cambió (pero sin assertions de URL exacta)

6. VALIDACIONES CORRECTAS
   - En lugar de: cy.url().should('include', '/admin')
   - Usar: cy.url().should('not.include', '/login')
   - O verificar presencia de elemento: cy.contains('Dashboard').should('exist')

7. ESTRUCTURA DE ARCHIVO
   cypress/e2e/
   ├── [role].cy.js (admin.cy.js, client.cy.js, mechanic.cy.js)
   ├── support/
   │   └── commands.js (comandos reutilizables)
   ├── cypress.env.json (credenciales de prueba)
   └── cypress.config.js (configuración principal)

8. CREDENCIALES Y DATOS DE PRUEBA
   - Guardar credenciales en cypress.env.json, NO en el código
   - Usar Cypress.env('admin') para acceder
   - Pre-poblar base de datos con usuarios de prueba
   - Resetear estado entre suites si es necesario

9. CASOS DE USO ESPECÍFICOS
   - Autenticación: Login, logout, validación de campos
   - Autorización: Acceso correcto por rol, bloqueo de rutas no permitidas
   - UI: Carga de página, visualización de datos, formularios
   - Errores: Rechazo de credenciales inválidas, campos requeridos

10. HEADLESS VS INTERFAZ
    - Headless (CI/CD): npx cypress run --headless
    - Interfaz (desarrollo): npx cypress open
    - Grabar videos: npx cypress run --record (requiere configuración)

Implementa esto y verifica que todos los tests pasen.
El resultado esperado es 100% de tests pasando sin flakiness.
```

---

## 🔍 Ejemplo Práctico - Test de Login en ServiCollantas

### Comando Reutilizable (support/commands.js)
```javascript
Cypress.Commands.add('login', (email, password) => {
  // ARRANGE: Navegar a login
  cy.visit('/login', { timeout: 30000 })
  
  // ACT: Llenar formulario
  cy.get('input[type="email"]', { timeout: 10000 }).type(email, { delay: 100 })
  cy.get('input[type="password"]', { timeout: 10000 }).type(password, { delay: 100 })
  cy.get('button[type="submit"]').click()
  
  // ESPERA CRÍTICA: Login toma tiempo, redirección también
  cy.wait(2500)
  
  // ASSERT: Verificar que estamos fuera del login (sin ser específicos)
  cy.url().should('not.include', '/login')
})
```

### Test Completo (e2e/admin.cy.js)
```javascript
describe('Admin Workflow - E2E Tests', () => {
  it('Should login successfully as admin', () => {
    // ARRANGE: Credenciales desde env
    const email = Cypress.env('admin').email
    const password = Cypress.env('admin').password
    
    // ACT: Usar comando reutilizable
    cy.login(email, password)
    
    // ASSERT: Verificar que el login funcionó
    cy.contains('Dashboard').should('be.visible')
    cy.get('[data-testid="user-menu"]').should('exist')
  })
  
  it('Should reject invalid credentials', () => {
    // ARRANGE
    const invalidEmail = 'wrong@example.com'
    const invalidPassword = 'wrong123'
    
    // ACT
    cy.visit('/login')
    cy.get('input[type="email"]').type(invalidEmail)
    cy.get('input[type="password"]').type(invalidPassword)
    cy.get('button[type="submit"]').click()
    
    // ASSERT: Debe seguir en login (sin redirigir)
    cy.url().should('include', '/login')
    cy.contains('Invalid credentials').should('be.visible')
  })
})
```

### Configuración (cypress.env.json)
```json
{
  "admin": {
    "email": "admin@servicollantas.com",
    "password": "admin123"
  },
  "client": {
    "email": "cliente@example.com",
    "password": "cliente123"
  },
  "mechanic": {
    "email": "mecanico@example.com",
    "password": "mecanico123"
  }
}
```

---

## ⚠️ Errores Comunes a EVITAR

| ❌ INCORRECTO | ✅ CORRECTO | ¿Por qué? |
|---|---|---|
| `cy.get('selector').click()` | `cy.get('selector', { timeout: 10000 }).click()` | Element puede no existir aún |
| `cy.url().should('equal', '/admin')` | `cy.url().should('not.include', '/login')` | Evita timing issues |
| Credenciales en el test | Credenciales en cypress.env.json | Seguridad |
| `cy.wait(1000)` después del login | `cy.wait(2500)` después del login | Login + redirección toman tiempo |
| `cy.get('.btn-random-123')` | `cy.get('button[data-testid="login"]')` | Classes cambian, selectores se rompen |
| Assertions directas después de click | Assertions después de cy.wait() | Race condition |

---

## 📊 Checklist para Validar tu Test E2E

- [ ] ¿El test usa Arrange-Act-Assert?
- [ ] ¿Tiene cy.wait() después de acciones async (login, submit)?
- [ ] ¿Espera elementos con timeout antes de interactuar?
- [ ] ¿Las credenciales están en cypress.env.json?
- [ ] ¿Usa selectores estables (data-testid, type, etc)?
- [ ] ¿Las assertions no son sobre URLs específicas sino sobre contenido?
- [ ] ¿Tiene un comando reutilizable para acciones comunes?
- [ ] ¿Pasó 3 veces seguidas sin flakiness?
- [ ] ¿Pasó en modo headless (CI/CD)?
- [ ] ¿La documentación está clara?

---

## 🚀 Cómo Generar Tests Nuevos

### 1️⃣ Define el Caso de Uso
```
"Usuario Admin puede crear un nuevo servicio"
```

### 2️⃣ Usa el Prompt
```
Genera un test E2E en Cypress que:
1. Haga login como admin
2. Navegue a Servicios
3. Haga click en "Nuevo Servicio"
4. Llene el formulario (nombre, descripción, precio)
5. Haga click en Crear
6. Verifique que aparezca en la tabla
Usar Arrange-Act-Assert, esperas de 2.5s después de async, y selectores estables.
```

### 3️⃣ Implementa y Valida
```bash
npx cypress open
# Haz click en el test
# Verifica visualmente que funciona
# Luego corre: npx cypress run --headless
```

---

## 📈 Evolución de Tests

```
Fase 1: Autenticación (COMPLETADO ✅)
  ├── Login
  ├── Logout
  ├── Validación de campos
  └── Rechazo de credenciales

Fase 2: Autorización (COMPLETADO ✅)
  ├── Acceso por rol
  ├── Bloqueo de rutas
  └── Redirecciones correctas

Fase 3: Funcionalidad (PRÓXIMO)
  ├── CRUD de servicios
  ├── CRUD de citas
  ├── Generación de reportes
  └── Gestión de facturas

Fase 4: Edge Cases
  ├── Datos inválidos
  ├── Timeouts de sesión
  ├── Conexión perdida
  └── Errores del servidor
```

---

## 🔗 Referencias

- **Cypress Best Practices**: https://docs.cypress.io/guides/references/best-practices
- **Cypress Commands**: https://docs.cypress.io/api/commands/and
- **Cypress Waits**: https://docs.cypress.io/guides/guides/network-requests#Waiting
- **Tu Implementación**: Ver frontend/cypress/e2e/ en tu proyecto

---

**Última actualización:** Diciembre 23, 2025  
**Estado:** ✅ Validado y funcionando en ServiCollantas (30/30 tests pasando)
