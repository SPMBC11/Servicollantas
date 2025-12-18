# ⚡ Despliegue Rápido - ServiCollantas

## 🎯 Resumen Ejecutivo

Esta es una guía rápida para desplegar tu proyecto en producción en **3 días** para presentarlo a ServiCollantas.

---

## 📅 Plan de 3 Días

### Día 1: Preparación y Despliegue Básico (2-3 horas)

#### 1. Subir código a GitHub
```bash
git init
git add .
git commit -m "Ready for production"
# Crear repositorio en GitHub y hacer push
```

#### 2. Crear Base de Datos (5 minutos)
- Ir a https://render.com → Crear cuenta
- "New +" → "PostgreSQL"
- Nombre: `servicollantas-db`
- Plan: Free
- **Copiar las credenciales** (host, user, password, database)

#### 3. Desplegar Backend (10 minutos)
- En Render: "New +" → "Web Service"
- Conectar repositorio de GitHub
- Configuración:
  - **Name**: `servicollantas-backend`
  - **Build Command**: `cd project/backend && npm install`
  - **Start Command**: `cd project/backend && npm start`
- **Variables de Entorno** (agregar todas):
  ```
  DB_HOST=tu-host-de-render
  DB_PORT=5432
  DB_NAME=servicollantas
  DB_USER=tu-usuario
  DB_PASSWORD=tu-password
  JWT_SECRET=genera-un-secreto-largo-y-seguro
  JWT_EXPIRES_IN=24h
  NODE_ENV=production
  FRONTEND_URL=https://servicollantas.vercel.app
  ```
- Click "Create Web Service"
- **Esperar 5-10 minutos** → Obtendrás: `https://servicollantas-backend.onrender.com`

#### 4. Desplegar Frontend (10 minutos)
- Ir a https://vercel.com → Crear cuenta con GitHub
- "Add New" → "Project"
- Seleccionar tu repositorio
- Configuración:
  - **Framework**: Vite
  - **Root Directory**: `project/frontend`
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
- **Variables de Entorno**:
  ```
  VITE_BACKEND_URL=https://servicollantas-backend.onrender.com
  VITE_API_BASE_URL=https://servicollantas-backend.onrender.com
  ```
- Click "Deploy"
- **Esperar 2-3 minutos** → Obtendrás: `https://servicollantas.vercel.app`

#### 5. Actualizar Backend con URL del Frontend
- En Render, editar variables de entorno:
  ```
  FRONTEND_URL=https://servicollantas.vercel.app
  ```
- Guardar → Se re-desplegará automáticamente

#### 6. Probar (5 minutos)
- Abrir: `https://servicollantas.vercel.app`
- Login con: `admin@servicollantas.com` / `admin123`
- Verificar que todo funcione

**✅ Día 1 Completado - Ya tienes la app en producción!**

---

### Día 2: Dominio Personalizado (Opcional - 1 hora)

#### Si quieres un dominio personalizado:

1. **Comprar dominio** (~$12/año):
   - Namecheap.com o Google Domains
   - Ejemplo: `servicollantas.com`

2. **Configurar en Vercel** (Frontend):
   - Settings → Domains → Agregar dominio
   - Seguir instrucciones de DNS

3. **Configurar en Render** (Backend):
   - Settings → Custom Domain
   - Agregar: `api.servicollantas.com`
   - Seguir instrucciones de DNS

4. **Actualizar DNS** en tu registrador:
   - Agregar los registros que te dieron Vercel y Render
   - Esperar 1-24 horas para propagación

5. **Actualizar variables de entorno**:
   - Backend: `FRONTEND_URL=https://servicollantas.com`
   - Frontend: `VITE_BACKEND_URL=https://api.servicollantas.com`

**✅ Día 2 Completado - Dominio configurado!**

---

### Día 3: Preparación para Presentación (1 hora)

1. **Cargar datos de ejemplo**:
   - Crear algunos servicios
   - Crear algunos mecánicos
   - Crear algunas citas de ejemplo

2. **Probar todas las funcionalidades**:
   - ✅ Login (admin, mechanic)
   - ✅ Crear cita desde la página principal
   - ✅ Dashboard de admin
   - ✅ Dashboard de mechanic
   - ✅ Generar link de calificación
   - ✅ Portal de calificación
   - ✅ Generar factura

3. **Preparar demo**:
   - Tener credenciales listas
   - Tener datos de ejemplo listos
   - Preparar explicación de funcionalidades

**✅ Día 3 Completado - Listo para presentar!**

---

## 🔑 URLs Finales

**Sin dominio personalizado**:
- Frontend: `https://servicollantas.vercel.app`
- Backend: `https://servicollantas-backend.onrender.com`

**Con dominio personalizado**:
- Frontend: `https://servicollantas.com`
- Backend: `https://api.servicollantas.com`

---

## 💰 Costos

### Opción Gratis (Para Demostración)
- Render Backend: **Gratis** (con limitaciones)
- Vercel Frontend: **Gratis** (ilimitado)
- Render PostgreSQL: **Gratis** (90 días)
- Dominio: **$12/año** (opcional)

**Total**: $0-12/año

### Opción Producción Real
- Render Backend: **$7/mes**
- Vercel Frontend: **Gratis**
- Render PostgreSQL: **$7/mes**
- Dominio: **$12/año**

**Total**: ~$14/mes + dominio

---

## ✅ Checklist Final

- [ ] Código en GitHub
- [ ] Base de datos creada
- [ ] Backend desplegado
- [ ] Frontend desplegado
- [ ] Variables de entorno configuradas
- [ ] Todo funciona correctamente
- [ ] Datos de ejemplo cargados
- [ ] Dominio configurado (opcional)
- [ ] Listo para presentar

---

## 🆘 Problemas Comunes

### "Cannot connect to database"
→ Verificar que las variables de entorno del backend estén correctas

### "CORS error"
→ Verificar que `FRONTEND_URL` en el backend sea la URL correcta del frontend

### "Build failed"
→ Verificar que todas las dependencias estén en `package.json`

### Frontend no se conecta al backend
→ Verificar `VITE_BACKEND_URL` en variables de entorno del frontend

---

## 📞 Recursos

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Guía Completa**: Ver `DEPLOYMENT_GUIDE.md`

---

**¡Listo para impresionar a ServiCollantas! 🚀**

