# 🔒 SEGURIDAD - ServiCollantas

## ⚠️ INCIDENT REPORT

**Fecha**: Diciembre 26, 2025  
**Severidad**: 🔴 CRÍTICA  
**Estado**: RESUELTO

### Problema
Contraseñas y secretos fueron expuestos en GitHub:
- Credenciales de base de datos en `check-password.js`
- Contraseñas de prueba en `cypress.env.json`
- Secretos en documentación

### Acciones Tomadas
✅ Actualizar `.gitignore` para proteger archivos sensibles  
✅ Crear `.env.example` sin valores reales  
✅ Crear `cypress.env.example` sin contraseñas  
✅ Documentación de seguridad  

---

## 🔑 CONFIGURACIÓN SEGURA

### 1. Backend (.env)

**NUNCA COMMIT**:
```bash
# ❌ NO HACER
git add backend/.env
git push

# ✅ SÍ HACER
cp backend/.env.example backend/.env
# Editar .env con valores REALES (no publicar)
```

**Archivo `backend/.env` debe tener**:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=servicollantas
DB_USER=postgres
DB_PASSWORD=tu_contraseña_real_aqui     # ⚠️ Nunca compartir

JWT_SECRET=secreto_muy_largo_32_chars   # ⚠️ Generar nuevo
JWT_EXPIRES_IN=8h

PORT=4000
NODE_ENV=production
```

### 2. Frontend/Cypress (cypress.env.json)

**NUNCA COMMIT**:
```bash
# ❌ NO HACER
git add frontend/cypress.env.json

# ✅ SÍ HACER
cp frontend/cypress.env.example frontend/cypress.env.json
# Editar con credenciales de prueba reales
```

---

## 🛡️ MEDIDAS DE SEGURIDAD IMPLEMENTADAS

### 1. Hashing de Contraseñas
```javascript
// ✅ Siempre usar bcryptjs
const hashedPassword = await bcrypt.hash(plainPassword, 10);
```

### 2. JWT Tokens
- Expiración: 8 horas
- Secreto: Variables de entorno (.env)
- Validación en cada request protegido

### 3. Rate Limiting
- Login: 5 intentos por 15 minutos
- Global: 100 solicitudes por 15 minutos

### 4. Headers Seguros (Helmet)
- Previene XSS, Clickjacking, MIME sniffing
- Content Security Policy

---

## 🚨 GESTIÓN DE CONTRASEÑAS DE MECÁNICO

### ❌ PROBLEMA ANTERIOR (Debe arreglarse)
```javascript
// Esto regeneraba contraseña CADA VEZ
app.get("/api/mechanics/:id/password", () => {
  const newPassword = generateRandomPassword();  // ❌ MAL
  // Guarda en BD cada vez
})
```

### ✅ SOLUCIÓN CORRECTA
La contraseña se genera **UNA SOLA VEZ** al crear el mecánico:

```javascript
app.post("/api/mechanics", authMiddleware(['admin']), async (req, res) => {
  // 1. Generar contraseña AQUÍ (al crear)
  const password = Math.random().toString(36).substring(2, 10);
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // 2. Guardar hash en BD
  await client.query(
    `INSERT INTO users (email, password_hash, ...) VALUES ($1, $2, ...)`,
    [email, hashedPassword, ...]
  );
  
  // 3. Mostrar al admin UNA SOLA VEZ
  res.json({
    mechanic: {...},
    credentials: {
      email: email,
      password: password,  // ⚠️ Se muestra solo aquí, nunca más
      message: "Guarda estas credenciales. No se mostrarán de nuevo."
    }
  });
});
```

### 🔄 Para Regenerar Contraseña
Solo si el mecánico olvida:
```javascript
app.post("/api/mechanics/:id/reset-password", authMiddleware(['admin']), async (req, res) => {
  const newPassword = Math.random().toString(36).substring(2, 10);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await client.query(
    'UPDATE users SET password_hash = $1 WHERE id = $2',
    [hashedPassword, mechanicId]
  );
  
  // Mostrar nueva contraseña al admin
  res.json({
    message: "Contraseña regenerada",
    password: newPassword
  });
});
```

---

## 📋 CHECKLIST DE SEGURIDAD

### Antes de Hacer Push a GitHub
- [ ] No hay `.env` archivos en git
- [ ] `cypress.env.json` NO está commiteado
- [ ] `check-password.js` NO está commiteado
- [ ] Ningún archivo con `password` o `secret` hardcodeado
- [ ] `.gitignore` está actualizado

### Antes de Producción
- [ ] JWT_SECRET es long y seguro (32+ caracteres)
- [ ] DB_PASSWORD es fuerte (12+ caracteres)
- [ ] NODE_ENV=production
- [ ] HTTPS habilitado
- [ ] CORS configurado correctamente
- [ ] Rate limiting activo

### Desarrollo Local
```bash
# 1. Copiar archivos de ejemplo
cp backend/.env.example backend/.env
cp frontend/cypress.env.example frontend/cypress.env.json

# 2. Editar con valores REALES (solo local)
nano backend/.env
nano frontend/cypress.env.json

# 3. Verificar que NO están en git
git status  # No debe mostrar estos archivos

# 4. Confirmar .gitignore
cat .gitignore | grep ".env"
```

---

## 🔐 CAMBIO DE CONTRASEÑA DE MECÁNICO (Flujo Correcto)

### 1️⃣ Admin Crea Mecánico
```
Admin crea mecánico → Se genera contraseña aleatoria → Admin ve contraseña UNA SOLA VEZ
```

### 2️⃣ Admin Envía Credenciales
- Via Email
- Via WhatsApp
- Via Mensaje

### 3️⃣ Mecánico Accede
- Usa credenciales enviadas
- Se autentica en `/mechanic/dashboard`

### 4️⃣ Mecánico Cambia Contraseña
- Panel del mecánico → Perfil → Cambiar Contraseña
- Requiere contraseña actual para validar

### 5️⃣ Si Olvida Contraseña
- Admin regenera → Nueva contraseña aleatoria
- Se muestra al admin UNA SOLA VEZ

---

## 🚀 DEPLOYMENT SEGURO

### AWS/Azure Secrets Manager
```bash
# NO hacer
DB_PASSWORD=micontraseña123

# ✅ SI hacer
# Guardar en AWS Secrets Manager o similar
aws secretsmanager create-secret --name servicollantas/db-password
```

### Docker Secrets
```dockerfile
# ❌ NO HACER
ENV DB_PASSWORD=micontraseña

# ✅ SI HACER
RUN --mount=type=secret,id=db_password
COPY --chown=root:root /run/secrets/db_password /app/.env
```

---

## 📞 CONTACTO DE SEGURIDAD

Si encuentras vulnerabilidades:
1. NO lo publiques en GitHub
2. Email privado al equipo
3. Describe el problema
4. Sugiere solución si es posible

---

**Última actualización**: 2025-12-26  
**Estado**: ✅ IMPLEMENTADO  
**Próxima revisión**: Semanal
