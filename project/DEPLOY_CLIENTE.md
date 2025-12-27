# 🚀 DEPLOY PARA MOSTRAR AL CLIENTE (15 minutos)

**Objetivo**: Tener tu proyecto en URLs públicas funcionando en producción

---

## 📋 ANTES DE EMPEZAR

✅ Asegúrate de tener:
- Cuenta en GitHub (sincronizado tu proyecto)
- Conexión a internet
- 15 minutos de tiempo

---

## PASO 1️⃣: FRONTEND EN VERCEL (8 minutos)

### Opción A: Desde GitHub (Más fácil)

```bash
# 1. Ve a https://vercel.com
# 2. Click en "Sign Up" → "Continue with GitHub"
# 3. Autoriza Vercel
# 4. Click en "Add New..." → "Project"
# 5. Busca tu repositorio "project-bolt-sb1-gddud527"
# 6. Click en "Import"

# En "Configure Project":
# - Framework: Vite
# - Root Directory: ./frontend
# - Build Command: npm run build
# - Output Directory: dist
# - Environment Variables: DEJAR EN BLANCO (por ahora)

# 7. Click en "Deploy"
# ¡LISTO! En 2-3 minutos tienes URL como:
# https://servi-collantas.vercel.app
```

### Opción B: Desde la línea de comandos

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Ir a la carpeta frontend
cd frontend

# 3. Deploy
vercel

# 4. Responde las preguntas:
#    - "Set up and deploy" → yes
#    - "Which scope" → Tu nombre
#    - "Link to existing project?" → no
#    - "Project name?" → servi-collantas
#    - "In which directory?" → ./
#    - "Want to modify vercel.json?" → no

# ¡LISTO! Tienes URL pública en 3 minutos
```

### Resultado
```
✅ URL: https://servi-collantas.vercel.app
✅ Automático: Cada push a GitHub = deploy automático
✅ HTTPS: Gratis y automático
```

**PERO ESPERA** ⚠️ Sin backend, la app no funciona. Vamos al paso 2.

---

## PASO 2️⃣: BACKEND EN RENDER (5 minutos)

### Opción A: Desde GitHub

```bash
# 1. Ve a https://render.com
# 2. Click en "Sign Up" → "Continue with GitHub"
# 3. Autoriza Render
# 4. Click en "New +" → "Web Service"
# 5. Conecta tu repositorio "project-bolt-sb1-gddud527"

# En la configuración:
# Name: servi-collantas-api
# Environment: Node
# Region: Cualquier región cercana
# Build Command: cd backend && npm install
# Start Command: node src/index.cjs

# Environment Variables (⚠️ IMPORTANTE):
```

**AGREGA ESTAS VARIABLES DE ENTORNO EN RENDER:**

```
# Base de datos
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui
DB_NAME=servi_collantas_db
DB_PORT=5432

# JWT
JWT_SECRET=tu_secreto_super_seguro_cambiar_esto_luego

# Environment
NODE_ENV=production

# Puerto
PORT=4000
```

⚠️ **IMPORTANTE**: Por ahora sin base de datos funcional en Render, necesitas migrar DB. Ver "PASO 3".

### Opción B: Usar Railway (Más fácil con DB)

```bash
# 1. Ve a https://railway.app
# 2. Sign up con GitHub
# 3. New Project → "Deploy from GitHub Repo"
# 4. Selecciona tu repo
# 5. Añade PostgreSQL desde Railway
# 6. Configura variables de entorno
# 7. Deploy automático
```

### Resultado
```
✅ URL Backend: https://servi-collantas-api.onrender.com
✅ Gratis los primeros meses
✅ Auto-deploy en cada push
```

---

## PASO 3️⃣: CONECTAR FRONTEND CON BACKEND

### En Vercel dashboard:

```
1. Ve a tu proyecto: servi-collantas
2. Configuración (Settings)
3. Environment Variables
4. Agrega variable:

   VITE_API_URL=https://servi-collantas-api.onrender.com

5. Redeploy
```

### En el código (opcional, si no funciona):

Archivo: `frontend/src/services/api.ts` (o .js)

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'https://servi-collantas-api.onrender.com';

export const api = axios.create({
  baseURL: API_URL
});
```

---

## PASO 4️⃣: BASE DE DATOS EN PRODUCCIÓN

### Opción A: Railway (Más fácil)
```bash
# Railway te proporciona PostgreSQL automáticamente
# Solo sigue el tutorial de Railway
# Te da la URL de conexión lista
```

### Opción B: En tu mismo servidor Render
```bash
# En Render agregar servicio "PostgreSQL"
# Automáticamente tienes DB en producción
```

### Opción C: Usar planeta.com (más barato)
```bash
# Hosting de BD separado
# $5-10/mes
# DB en cloud, dedicada
```

---

## ✅ CHECKLIST FINAL

```
[ ] Frontend en Vercel (con URL https://...)
[ ] Backend en Render/Railway (con URL https://...)
[ ] Variables de entorno configuradas
[ ] Base de datos funcionando
[ ] Frontend conectado al backend
[ ] Probar login: debe funcionar
[ ] Probar crear cita: debe funcionar
```

---

## 🧪 PROBAR QUE FUNCIONA

### 1. Ir a tu URL frontend
```
https://servi-collantas.vercel.app
```

### 2. Login con credenciales de demo
```
Email: admin@servicollantas.com
Password: admin123
```

### 3. Probar funcionalidades
```
✅ Crear servicio
✅ Crear mecánico
✅ Ver facturas
✅ Crear cita
```

### Si no funciona:
```bash
# 1. Verificar que backend está online:
curl https://servi-collantas-api.onrender.com/api/health

# 2. Verificar logs en Vercel dashboard
# 3. Verificar logs en Render dashboard
# 4. Revisar Network tab (F12 en navegador)
```

---

## 🎯 URLS PARA TU CLIENTE

Envíale esto:

```
🌐 Tu aplicación:
https://servi-collantas.vercel.app

👤 Credenciales de prueba:
Email: admin@servicollantas.com
Password: admin123

📱 Funcionalidades a probar:
✅ Login
✅ Dashboard de admin
✅ Crear mecánico
✅ Crear cliente
✅ Crear servicio
✅ Agendar cita
✅ Ver facturas

⏱️ Nota: Primer acceso toma 20 segundos (warm up del servidor)
```

---

## 📊 COSTOS

| Servicio | Gratis | Después |
|----------|--------|---------|
| Vercel Frontend | Sí, para siempre | - |
| Render Backend | Sí, primeros 750 horas/mes | $7/mes después |
| Railway DB | Sí, primeros meses | $5-10/mes |
| **TOTAL** | **$0** | **~$12-17/mes** |

---

## 🚀 PRÓXIMOS PASOS (Después que apruebes el cliente)

1. **Subir base de datos real** con datos de producción
2. **Configurar dominio propio** (si la empresa quiere)
3. **Certificados SSL** (Let's Encrypt, gratis)
4. **Backups automáticos** de base de datos
5. **CI/CD automático** (ya está en GitHub Actions)
6. **Monitoreo y alertas** (Sentry, etc)

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Puedo usar el dominio de la empresa?**
R: Sí, cambiando los DNS a apuntar a Vercel. Te ayudo después.

**P: ¿Y si el servidor se cae?**
R: Render y Vercel tienen 99.9% uptime. Muy raro.

**P: ¿Los datos se pierden?**
R: No, están en PostgreSQL. Pero necesitas backups automáticos.

**P: ¿Puedo cambiar la URL?**
R: Sí, en cualquier momento (sin costo adicional).

**P: ¿Mi cliente ve todo?**
R: Sí, todo en producción 100% funcional.

---

**Documento creado**: 26 Diciembre 2025  
**Tiempo total**: 15 minutos para tener algo funcionando  
**Costo**: $0  
**Listo para mostrar**: ✅ SÍ
