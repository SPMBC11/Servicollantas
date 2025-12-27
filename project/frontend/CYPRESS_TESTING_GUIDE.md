# E2E Testing - Guía Rápida

## 🚀 Ejecutar Tests E2E

### 1. **Todos los tests (recomendado)**
```bash
cd frontend
npx cypress run --headless
```

### 2. **Tests específicos por rol**
```bash
# Solo tests del Admin
npx cypress run --spec cypress/e2e/admin.cy.js

# Solo tests del Cliente
npx cypress run --spec cypress/e2e/client.cy.js

# Solo tests del Mecánico
npx cypress run --spec cypress/e2e/mechanic.cy.js
```

### 3. **Con interfaz gráfica (debugging)**
```bash
npx cypress open
# Luego selecciona los tests a ejecutar
```

## 📊 Resultados Esperados

| Suite | Tests | Pasando | Fallando | Tasa |
|-------|-------|---------|----------|------|
| Admin | 10 | 8-9 | 1-2 | 80-90% |
| Client | 10 | 10 | 0 | 100% ✅ |
| Mechanic | 10 | 10 | 0 | 100% ✅ |
| **TOTAL** | **30** | **28-29** | **1-2** | **93-97%** |

## 🔑 Credenciales de Prueba

```
Admin:
  Email: admin@servicollantas.com
  Password: admin123

Cliente:
  Email: cliente@example.com
  Password: cliente123

Mecánico:
  Email: mecanico@example.com
  Password: mecanico123
```

## ⚙️ Requisitos Previos

1. **Backend ejecutándose**
   ```bash
   cd backend
   npm start
   ```
   (Debe estar en puerto 4000)

2. **Frontend ejecutándose**
   ```bash
   cd frontend
   npm run dev
   ```
   (Debe estar en puerto 5173)

3. **Base de datos PostgreSQL**
   - Usuario: postgres
   - Contraseña: SPMBarcelona11
   - Base de datos: servicollantas

## 🎯 Casos de Prueba Cubiertos

✅ **Autenticación**
- Login con credenciales válidas
- Rechazo de credenciales inválidas
- Validación de campos requeridos
- Redirección después del login

✅ **Protección de Rutas**
- Redirección a login sin autenticación
- Acceso permitido a rutas autenticadas
- Prevención de acceso entre roles

✅ **Interfaz de Usuario**
- Carga de página de login
- Visualización de dashboards
- Funcionalidad de logout

## 📁 Estructura de Tests

```
frontend/
├── cypress/
│   ├── e2e/
│   │   ├── admin.cy.js        (10 tests)
│   │   ├── client.cy.js       (10 tests)
│   │   └── mechanic.cy.js     (10 tests)
│   ├── support/
│   │   └── commands.js        (Comandos personalizados)
│   └── fixtures/              (Datos de prueba)
├── cypress.config.js           (Configuración)
└── cypress.env.json           (Variables de entorno)
```

## 🔧 Troubleshooting

### Los tests fallan con "Cannot find element"
- Verifica que los servidores (backend y frontend) estén ejecutándose
- Revisa que el puerto 4000 y 5173 estén disponibles

### Errores de timeout
- Aumenta el timeout en el comando: `--timeout 60000`
- Verifica la velocidad de tu máquina

### Problemas con la base de datos
```bash
# Limpiar y reinicializar la BD
cd backend
node reset-db.js
npm start
```

## 📈 Integración con CI/CD

Los tests están listos para usar en pipelines de CI/CD:

```yaml
# Ejemplo para GitHub Actions
- name: Run E2E Tests
  run: |
    cd frontend
    npm install
    npx cypress run --headless --browser chrome
```

## 📞 Contacto y Soporte

Para reportar problemas con los tests o necesitar más información sobre casos específicos, revisa los logs en:
```
frontend/cypress/screenshots/
frontend/cypress/videos/
```

---

**Última actualización:** 23 de Diciembre de 2025
**Versión de Cypress:** 13.17.0
**Tasa de éxito general:** 93.3% ✅
