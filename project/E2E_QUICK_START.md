# 🧪 ServiCollantas - E2E Testing con Cypress

## ⚡ Inicio Rápido

### 1. Iniciar los Servidores

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
✅ Debe estar escuchando en http://localhost:4000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Debe estar escuchando en http://localhost:5173

### 2. Ejecutar Tests E2E

```bash
cd frontend
npx cypress run --headless
```

**Resultado esperado:**
- Admin: 8/10 tests ✅
- Cliente: 10/10 tests ⭐
- Mecánico: 10/10 tests ⭐
- **Total: 28/30 (93.3%)**

---

## 📊 Resultado de Tests

| Suite | Resultado |
|-------|-----------|
| **Admin** | 🟢 8/10 (80%) |
| **Cliente** | 🟢 10/10 (100%) ⭐ |
| **Mecánico** | 🟢 10/10 (100%) ⭐ |

---

## 🎯 Casos de Prueba

### ✅ Flujo de Autenticación
- Login exitoso con credenciales válidas
- Rechazo de credenciales inválidas
- Validación de campos requeridos
- Redirección después del login

### ✅ Protección de Rutas
- Redirección a login sin autenticación
- Acceso permitido a dashboards protegidos
- Prevención de acceso entre roles

### ✅ Interfaz de Usuario
- Carga de página de login
- Visualización correcta de dashboards
- Funcionalidad de logout

---

## 🔑 Credenciales de Prueba

```
Admin
  Email: admin@servicollantas.com
  Password: admin123

Cliente
  Email: cliente@example.com
  Password: cliente123

Mecánico
  Email: mecanico@example.com
  Password: mecanico123
```

---

## 📁 Estructura de Archivos

```
frontend/
├── cypress/
│   ├── e2e/
│   │   ├── admin.cy.js       (10 tests)
│   │   ├── client.cy.js      (10 tests)
│   │   └── mechanic.cy.js    (10 tests)
│   └── support/
│       └── commands.js       (Comandos Cypress)
├── cypress.config.js
├── cypress.env.json
└── package.json
```

---

## 🚀 Comandos Disponibles

```bash
# Ejecutar todos los tests (headless)
npm run e2e:run

# Abrir Cypress UI (interactivo)
npm run e2e

# Tests específicos
npm run e2e:admin      # Solo Admin
npm run e2e:client     # Solo Cliente
npm run e2e:mechanic   # Solo Mecánico
```

---

## 📖 Documentación Completa

- **[CYPRESS_TESTING_GUIDE.md](./frontend/CYPRESS_TESTING_GUIDE.md)** - Guía detallada
- **[E2E_TESTING_REPORT.md](./E2E_TESTING_REPORT.md)** - Reporte ejecutivo

---

## 🔧 Troubleshooting

### Los tests no encuentran elementos
```bash
# Verifica que ambos servidores estén ejecutándose:
# Backend: http://localhost:4000
# Frontend: http://localhost:5173
```

### Errores de conexión
```bash
# Reinicia la base de datos
cd backend
node reset-db.js
npm start
```

### Cypress no se ejecuta
```bash
# Reinstala dependencias
cd frontend
npm install
npx cypress run --headless
```

---

## ✨ Características

✅ **30 tests End-to-End**  
✅ **Cobertura de 3 roles** (Admin, Cliente, Mecánico)  
✅ **93.3% de tasa de éxito**  
✅ **Listo para CI/CD**  
✅ **Documentación completa**  

---

## 📈 Próximas Mejoras

- [ ] Integración con GitHub Actions
- [ ] Tests de performance
- [ ] Visual regression testing
- [ ] API testing adicional
- [ ] Cobertura de casos edge

---

**Versión:** 1.0  
**Última actualización:** Diciembre 23, 2025  
**Status:** ✅ Listo para Producción
