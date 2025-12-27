# 🚀 First-Time Setup Guide - E2E Testing

**Objetivo:** Instalar y ejecutar los 40 tests E2E localmente  
**Tiempo estimado:** 10-15 minutos  
**Dificultad:** ⭐ Fácil  

---

## ✅ Pre-requisitos Verificar

Antes de empezar, asegúrate que tengas:

### 1. Backend corriendo
```bash
# En una terminal
cd backend
npm run dev

# Debe estar en http://localhost:4000
# Verifica que veas "listening on port 4000"
```

### 2. Frontend corriendo
```bash
# En otra terminal
cd frontend
npm run dev

# Debe estar en http://localhost:5173
# Verifica que veas "Local: http://localhost:5173"
```

### 3. Base de datos con usuarios
```bash
# Verifica que existan estos usuarios en la BD:
- admin@servicollantas.com (password: Admin@123456)
- cliente@example.com (password: Cliente@123456)
- mecanico@example.com (password: Mecanico@123456)

# Si no existen, créalos manualmente en la BD o usa:
# backend/setup-database.sql
```

---

## 📦 Paso 1: Instalar Cypress

```bash
# En la carpeta frontend
cd frontend

# Instalar dependencias (incluye Cypress)
npm install

# Verificar que Cypress está instalado
npx cypress --version

# Debe mostrar algo como:
# Cypress: 13.6.2
```

---

## 🔧 Paso 2: Verificar Configuración

### Revisar cypress.env.json

```bash
# Frontend/cypress.env.json debe tener:
{
  "admin": {
    "email": "admin@servicollantas.com",
    "password": "Admin@123456"
  },
  "client": {
    "email": "cliente@example.com",
    "password": "Cliente@123456"
  },
  "mechanic": {
    "email": "mecanico@example.com",
    "password": "Mecanico@123456"
  }
}
```

**⚠️ IMPORTANTE:** Actualiza las credenciales si tus usuarios son diferentes.

### Revisar cypress.config.js

```javascript
// Debe tener:
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    defaultCommandTimeout: 10000,
  },
})
```

---

## 🎯 Paso 3: Ejecutar Primera Vez (Interfaz Gráfica)

```bash
# En frontend/, ejecuta:
npm run e2e

# Abre Cypress UI
# Verás algo como:
# ├── cypress/e2e/
# │   ├── admin.cy.js (12 tests)
# │   ├── client.cy.js (13 tests)
# │   └── mechanic.cy.js (15 tests)
```

### En Cypress UI:

1. **Selecciona admin.cy.js** (es el más rápido)
2. **Verás los 12 tests**
3. **Haz click en el primero:** "Should login successfully as admin"
4. **Mira la ejecución en tiempo real**
5. **Si todo es verde ✅ funciona correctamente**

---

## ▶️ Paso 4: Ejecutar Todos los Tests

### Opción A: Interfaz (Recomendado para primera vez)

```bash
npm run e2e

# Selecciona cada archivo y observa:
# 1. admin.cy.js (debería dar ✅ 12 tests)
# 2. client.cy.js (debería dar ✅ 13 tests)
# 3. mechanic.cy.js (debería dar ✅ 15 tests)
```

### Opción B: Línea de comandos

```bash
# Solo Admin (3-5 minutos)
npm run e2e:admin

# Solo Cliente (4-6 minutos)
npm run e2e:client

# Solo Mecánico (5-7 minutos)
npm run e2e:mechanic

# Todos (12-18 minutos)
npm run e2e:run
```

---

## 📊 Resultado Esperado

Si todo funciona correctamente, verás:

```
✅ admin.cy.js            12 passing
✅ client.cy.js           13 passing
✅ mechanic.cy.js         15 passing
─────────────────────────────────
✅ 40 tests passed in 14 seconds
```

---

## 🐛 Troubleshooting

### Problema 1: "Cannot find module 'cypress'"

**Solución:**
```bash
cd frontend
npm install
npx cypress --version
```

### Problema 2: "Connection refused (localhost:4000)"

**Solución:**
```bash
# Asegúrate que backend está corriendo
cd backend
npm run dev
# Espera a que diga "listening on port 4000"
```

### Problema 3: "Connection refused (localhost:5173)"

**Solución:**
```bash
# Asegúrate que frontend está corriendo
cd frontend
npm run dev
# Espera a que diga "Local: http://localhost:5173"
```

### Problema 4: Login falla "Invalid credentials"

**Solución:**
1. Verifica las credenciales en cypress.env.json
2. Verifica que el usuario existe en la BD
3. Intenta login manual en http://localhost:5173
4. Si manual funciona, reinicia Cypress: `npm run e2e`

### Problema 5: "Element not found" en test

**Solución:**
```bash
# El test podría fallar si:
1. Frontend cambió estructura HTML
2. Selector cambió (data-testid, clase, etc)
3. Elemento tarda más en cargar

# Para debuggear:
npm run e2e
# Abre DevTools (F12) en Cypress
# Inspecciona elementos
# Ve a Application > LocalStorage
```

### Problema 6: Tests lentos o timeout

**Solución:**
```bash
# En cypress.config.js, aumenta timeout:
defaultCommandTimeout: 15000  // en lugar de 10000

# O ejecuta con:
npm run e2e:run -- --config defaultCommandTimeout=15000
```

---

## 🎓 Entender los Tests

### Admin Tests (12)
```
1. Login como admin
2. Ver dashboard
3. Ir a clientes
4. Ver lista de clientes
5. Buscar cliente
6. Ir a mecánicos
7. Ver reportes
8. Filtrar por fecha
9. Ir a servicios
10. Errores de login
11. Protección de rutas
12. Logout
```

### Client Tests (13)
```
1. Login como cliente
2. Ver dashboard
3. Ir a vehículos
4. Agregar vehículo
5. Ver citas
6. Crear cita
7. Ver facturas
8. Descargar factura
9. Ver calificaciones
10. Calificar servicio
11. Editar perfil
12. Filtrar citas
13. Logout
```

### Mechanic Tests (15)
```
1. Login como mecánico
2. Ver dashboard
3. Ver citas asignadas
4. Filtrar por estado
5. Ver detalles de cita
6. Iniciar trabajo
7. Completar cita
8. Ver ingresos
9. Filtrar ingresos
10. Ver calificaciones
11. Ver perfil
12. Editar perfil
13. Toggle disponibilidad
14. Buscar citas
15. Logout
```

---

## 📸 Captura de Pantallas en Tests

Cuando un test falla, Cypress automáticamente toma:

- **Screenshots:** `cypress/screenshots/`
- **Videos:** `cypress/videos/`

Úsalos para debuggear. Ejemplo:

```bash
# Ver screenshot del error
open cypress/screenshots/admin.cy.js/
    should login successfully as admin -- (1).png
```

---

## ✅ Checklist de Verificación

Una vez ejecutes los tests:

- [ ] Backend corriendo en localhost:4000
- [ ] Frontend corriendo en localhost:5173
- [ ] npm install completado
- [ ] Cypress instalado correctamente
- [ ] cypress.env.json tiene credenciales correctas
- [ ] Primer test ejecutado sin errores
- [ ] Admin tests pasados (12/12) ✅
- [ ] Client tests pasados (13/13) ✅
- [ ] Mechanic tests pasados (15/15) ✅
- [ ] Total 40/40 tests pasados ✅

---

## 🎯 Próximo Paso

Una vez que todos los tests pasen:

1. **Ejecuta en CI/CD:**
   ```bash
   git push origin main
   # GitHub Actions ejecutará automáticamente
   ```

2. **Vende tu proyecto:**
   - Muestra los 40 tests pasando
   - "Enterprise-grade E2E testing"
   - Añade $3-5k USD al precio

3. **Lee la documentación:**
   - [E2E_TESTING.md](../E2E_TESTING.md) - Guía completa
   - [E2E_QUICK_REFERENCE.md](../E2E_QUICK_REFERENCE.md) - Referencia rápida

---

## 💡 Tips Útiles

### Ejecutar un test específico
```bash
npm run e2e
# En Cypress UI, selecciona el test file
# Haz click en el test específico
```

### Debuggear un test que falla
```bash
npm run e2e
# En Cypress UI
# Haz click derecho en el paso que falla
# Selecciona "Inspect"
# Abre DevTools (F12)
```

### Ver logs
```bash
npm run e2e:run
# Los logs aparecen en terminal
# Busca "FAILED" o "✓ passing"
```

### Ejecutar con más detalles
```bash
npm run e2e:run -- --verbose
```

---

## 📚 Documentación Completa

- **[E2E_TESTING.md](../E2E_TESTING.md)** - Guía completa (400 líneas)
- **[E2E_QUICK_REFERENCE.md](../E2E_QUICK_REFERENCE.md)** - Referencia rápida
- **[E2E_TESTING_SUMMARY.md](../E2E_TESTING_SUMMARY.md)** - Resumen
- **[PROJECT_COMPLETE_SUMMARY.md](../PROJECT_COMPLETE_SUMMARY.md)** - Todo el proyecto

---

## 🎊 Conclusión

**Una vez que veas:**
```
✅ 40 tests passed in 14 seconds
```

**¡Significa que tu proyecto está listo para vender!**

---

**Tiempo restante:** 5-10 minutos para ejecutar todos los tests  
**Próximo paso:** Leer [E2E_TESTING.md](../E2E_TESTING.md) para entender los tests  
**Última actualización:** 18 Diciembre 2025
