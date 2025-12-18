# 🚀 Guía de Despliegue en Producción - ServiCollantas

Esta guía te ayudará a desplegar tu proyecto en producción para presentarlo a la empresa ServiCollantas.

## 📋 Tabla de Contenidos

1. [Opciones de Hosting](#opciones-de-hosting)
2. [Preparación del Proyecto](#preparación-del-proyecto)
3. [Despliegue del Backend](#despliegue-del-backend)
4. [Despliegue del Frontend](#despliegue-del-frontend)
5. [Configuración de Base de Datos](#configuración-de-base-de-datos)
6. [Configuración de Dominio](#configuración-de-dominio)
7. [Verificación Final](#verificación-final)
8. [Mantenimiento](#mantenimiento)

---

## 🌐 Opciones de Hosting

### Recomendación: Opción 1 (Más Fácil y Gratis)

**Backend**: [Render](https://render.com) o [Railway](https://railway.app)  
**Frontend**: [Vercel](https://vercel.com) o [Netlify](https://netlify.com)  
**Base de Datos**: [Render PostgreSQL](https://render.com/docs/databases) o [Supabase](https://supabase.com)

**Ventajas**:
- ✅ Gratis para proyectos pequeños/medianos
- ✅ Fácil configuración
- ✅ Despliegue automático desde GitHub
- ✅ SSL/HTTPS incluido
- ✅ Dominio personalizado gratuito

### Opción 2: Todo en Render

**Backend, Frontend y Base de Datos**: Todo en Render

**Ventajas**:
- ✅ Todo en un solo lugar
- ✅ Más fácil de gestionar
- ✅ Gratis con limitaciones

### Opción 3: VPS (Servidor Virtual)

**Servidor**: DigitalOcean, AWS, Google Cloud, Azure

**Ventajas**:
- ✅ Control total
- ✅ Más recursos
- ⚠️ Requiere más conocimiento técnico

---

## 🔧 Preparación del Proyecto

### Paso 1: Preparar el Código para Producción

#### 1.1 Verificar que todo funcione localmente

```bash
# Backend
cd project/backend
npm install
npm run dev
# Verificar que funcione en http://localhost:4000

# Frontend
cd project/frontend
npm install
npm run dev
# Verificar que funcione en http://localhost:5173
```

#### 1.2 Crear archivos de configuración de producción

**Backend - `project/backend/.env.production`**:
```env
# Base de Datos (se configurará después)
DB_HOST=tu-host-postgresql
DB_PORT=5432
DB_NAME=servicollantas
DB_USER=tu-usuario
DB_PASSWORD=tu-contraseña-segura

# JWT
JWT_SECRET=genera-un-secreto-muy-largo-y-seguro-aqui
JWT_EXPIRES_IN=24h

# Servidor
PORT=4000
NODE_ENV=production

# Frontend URL (se actualizará después del despliegue)
FRONTEND_URL=https://tu-dominio-frontend.com
```

**Frontend - `project/frontend/.env.production`**:
```env
VITE_BACKEND_URL=https://tu-backend-url.com
VITE_API_BASE_URL=https://tu-backend-url.com
```

#### 1.3 Verificar scripts en package.json

**Backend `package.json`** debe tener:
```json
{
  "scripts": {
    "start": "node src/index.cjs",
    "dev": "nodemon src/index.cjs"
  }
}
```

**Frontend `package.json`** debe tener:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

#### 1.4 Subir código a GitHub

```bash
# Si no tienes repositorio
git init
git add .
git commit -m "Initial commit - Ready for production"
git branch -M main

# Crear repositorio en GitHub y luego:
git remote add origin https://github.com/tu-usuario/servicollantas.git
git push -u origin main
```

---

## 🗄️ Configuración de Base de Datos

### Opción A: Render PostgreSQL (Recomendado)

1. **Crear cuenta en Render**: https://render.com
2. **Crear Base de Datos**:
   - Click en "New +" → "PostgreSQL"
   - Nombre: `servicollantas-db`
   - Plan: Free (o pago si necesitas más)
   - Región: Elige la más cercana
   - Click "Create Database"

3. **Obtener credenciales**:
   - Una vez creada, verás:
     - **Internal Database URL**: `postgresql://user:password@host:5432/dbname`
     - **External Connection String**: Para conectar desde fuera de Render
   - **Guarda estas credenciales** (las necesitarás después)

### Opción B: Supabase (Alternativa)

1. **Crear cuenta**: https://supabase.com
2. **Crear proyecto**:
   - Click "New Project"
   - Nombre: `servicollantas`
   - Contraseña: Genera una segura
   - Región: Elige la más cercana
3. **Obtener credenciales**:
   - Ve a Settings → Database
   - Copia la "Connection string"

### Opción C: Railway PostgreSQL

1. **Crear cuenta**: https://railway.app
2. **Crear proyecto** → "New Project"
3. **Agregar PostgreSQL**:
   - Click "New" → "Database" → "PostgreSQL"
4. **Obtener credenciales**:
   - Click en la base de datos → "Variables"
   - Copia las variables de conexión

---

## 🖥️ Despliegue del Backend

### Opción 1: Render (Recomendado)

#### Paso 1: Crear Web Service

1. En Render, click "New +" → "Web Service"
2. Conecta tu repositorio de GitHub
3. Selecciona el repositorio `servicollantas`

#### Paso 2: Configurar el Servicio

**Configuración básica**:
- **Name**: `servicollantas-backend`
- **Environment**: `Node`
- **Build Command**: `cd project/backend && npm install`
- **Start Command**: `cd project/backend && npm start`
- **Root Directory**: `project/backend` (opcional, si quieres simplificar)

**Variables de Entorno**:
```
DB_HOST=tu-host-postgresql
DB_PORT=5432
DB_NAME=servicollantas
DB_USER=tu-usuario
DB_PASSWORD=tu-contraseña
JWT_SECRET=tu-secreto-jwt-muy-largo
JWT_EXPIRES_IN=24h
NODE_ENV=production
FRONTEND_URL=https://tu-frontend-url.vercel.app
```

> ⚠️ **Importante**: Reemplaza los valores con los de tu base de datos

#### Paso 3: Desplegar

1. Click "Create Web Service"
2. Render comenzará a construir y desplegar
3. Espera a que termine (5-10 minutos)
4. Obtendrás una URL como: `https://servicollantas-backend.onrender.com`

#### Paso 4: Verificar

```bash
# Probar el health check
curl https://tu-backend-url.onrender.com/api/health
```

### Opción 2: Railway

1. **Crear cuenta**: https://railway.app
2. **Nuevo Proyecto** → "Deploy from GitHub repo"
3. **Seleccionar repositorio**
4. **Configurar**:
   - Root Directory: `project/backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Variables de Entorno**: Agregar las mismas que en Render
6. **Desplegar**: Railway lo hará automáticamente

---

## 🎨 Despliegue del Frontend

### Opción 1: Vercel (Recomendado - Más Fácil)

#### Paso 1: Crear cuenta

1. Ve a https://vercel.com
2. Sign up con GitHub
3. Autoriza acceso a tus repositorios

#### Paso 2: Importar Proyecto

1. Click "Add New" → "Project"
2. Selecciona tu repositorio `servicollantas`
3. **Configuración**:
   - **Framework Preset**: Vite
   - **Root Directory**: `project/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Paso 3: Variables de Entorno

En la configuración del proyecto, agrega:
```
VITE_BACKEND_URL=https://tu-backend-url.onrender.com
VITE_API_BASE_URL=https://tu-backend-url.onrender.com
```

> ⚠️ Reemplaza con la URL real de tu backend

#### Paso 4: Desplegar

1. Click "Deploy"
2. Vercel construirá y desplegará automáticamente
3. Obtendrás una URL como: `https://servicollantas.vercel.app`

### Opción 2: Netlify

1. **Crear cuenta**: https://netlify.com
2. **Add new site** → "Import an existing project"
3. **Conectar GitHub** y seleccionar repositorio
4. **Configuración**:
   - Base directory: `project/frontend`
   - Build command: `npm run build`
   - Publish directory: `project/frontend/dist`
5. **Variables de Entorno**: Agregar las mismas que en Vercel
6. **Deploy site**

### Opción 3: Render (Frontend también)

1. En Render, "New +" → "Static Site"
2. Conectar repositorio
3. **Configuración**:
   - Build Command: `cd project/frontend && npm install && npm run build`
   - Publish Directory: `project/frontend/dist`
4. **Variables de Entorno**: Agregar las mismas
5. **Create Static Site**

---

## 🌍 Configuración de Dominio Personalizado

### Paso 1: Comprar Dominio (Opcional)

**Opciones de registradores**:
- [Namecheap](https://namecheap.com) - ~$10-15/año
- [Google Domains](https://domains.google) - ~$12/año
- [GoDaddy](https://godaddy.com) - ~$12-15/año

**Ejemplo**: `servicollantas.com` o `servicollantas.co`

### Paso 2: Configurar Dominio en Vercel (Frontend)

1. En tu proyecto de Vercel, ve a **Settings** → **Domains**
2. Agrega tu dominio: `servicollantas.com`
3. Vercel te dará instrucciones de DNS:
   - Agrega un registro **A** o **CNAME**
   - Ejemplo:
     ```
     Type: CNAME
     Name: @
     Value: cname.vercel-dns.com
     ```

### Paso 3: Configurar Dominio en Render (Backend)

1. En Render, ve a tu servicio → **Settings** → **Custom Domain**
2. Agrega tu subdominio: `api.servicollantas.com`
3. Render te dará un registro DNS:
   ```
   Type: CNAME
   Name: api
   Value: tu-servicio.onrender.com
   ```

### Paso 4: Configurar DNS en tu Registrador

1. Ve al panel de tu registrador de dominio
2. Busca "DNS Management" o "Name Servers"
3. Agrega los registros que te dieron Vercel y Render:

**Ejemplo de configuración DNS**:
```
Type    Name    Value                    TTL
A       @       76.76.21.21             3600
CNAME   www     cname.vercel-dns.com     3600
CNAME   api     tu-backend.onrender.com   3600
```

4. Espera 24-48 horas para que se propague (a veces es instantáneo)

### Paso 5: Actualizar Variables de Entorno

**Backend**:
```
FRONTEND_URL=https://servicollantas.com
```

**Frontend**:
```
VITE_BACKEND_URL=https://api.servicollantas.com
VITE_API_BASE_URL=https://api.servicollantas.com
```

**Re-desplegar** ambos servicios para aplicar cambios.

---

## ✅ Verificación Final

### Checklist de Verificación

- [ ] Backend responde en la URL de producción
- [ ] Frontend carga correctamente
- [ ] Base de datos conectada (verificar logs del backend)
- [ ] Login funciona (probar con credenciales de admin)
- [ ] Crear una cita de prueba
- [ ] Generar un link de calificación
- [ ] Probar el portal de calificación
- [ ] Verificar que las notificaciones funcionen
- [ ] Probar en diferentes navegadores
- [ ] Probar en móvil (responsive)

### Comandos de Prueba

```bash
# 1. Health check del backend
curl https://tu-backend-url.com/api/health

# 2. Probar login
curl -X POST https://tu-backend-url.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@servicollantas.com","password":"admin123"}'

# 3. Verificar servicios
curl https://tu-backend-url.com/api/services
```

### Pruebas en el Navegador

1. **Abrir el frontend**: `https://tu-dominio.com`
2. **Probar login** con credenciales de admin
3. **Crear una cita de prueba**
4. **Verificar dashboard**
5. **Probar todas las funcionalidades principales**

---

## 🔄 Mantenimiento

### Actualizaciones

**Render/Railway/Vercel**:
- Cada push a `main` desplegará automáticamente
- O puedes hacer deploy manual desde el dashboard

### Monitoreo

**Render Dashboard**:
- Ver logs en tiempo real
- Ver métricas de uso
- Ver estado del servicio

**Vercel Dashboard**:
- Ver analytics
- Ver logs de build
- Ver errores

### Backups de Base de Datos

**Render PostgreSQL**:
- Backups automáticos diarios (en plan pago)
- O exportar manualmente:
```bash
pg_dump -h host -U user -d servicollantas > backup.sql
```

**Supabase**:
- Backups automáticos incluidos
- Puedes descargar desde el dashboard

### Logs y Debugging

**Ver logs del backend**:
- Render: Dashboard → Tu servicio → Logs
- Railway: Dashboard → Tu servicio → Logs

**Ver logs del frontend**:
- Vercel: Dashboard → Tu proyecto → Functions → Logs
- O usar la consola del navegador

---

## 📊 Costos Estimados

### Opción Gratis (Para Demostración)

- **Render Backend**: Gratis (con limitaciones)
- **Vercel Frontend**: Gratis (ilimitado)
- **Render PostgreSQL**: Gratis (90 días, luego $7/mes)
- **Dominio**: ~$12/año (opcional)

**Total**: ~$12/año (solo dominio) o $0 si usas subdominios gratuitos

### Opción Producción Real

- **Render Backend**: $7/mes (Starter)
- **Vercel Frontend**: Gratis
- **Render PostgreSQL**: $7/mes
- **Dominio**: ~$12/año

**Total**: ~$14/mes + dominio

---

## 🎯 Pasos Rápidos para Presentar a la Empresa

### Día 1: Preparación
1. ✅ Subir código a GitHub
2. ✅ Crear base de datos en Render/Supabase
3. ✅ Desplegar backend en Render
4. ✅ Desplegar frontend en Vercel
5. ✅ Probar que todo funcione

### Día 2: Dominio (Opcional)
1. ✅ Comprar dominio
2. ✅ Configurar DNS
3. ✅ Esperar propagación
4. ✅ Actualizar variables de entorno

### Día 3: Presentación
1. ✅ Verificar que todo funcione
2. ✅ Preparar demo con datos de ejemplo
3. ✅ Mostrar a la empresa

---

## 🆘 Solución de Problemas Comunes

### Error: "Cannot connect to database"

**Solución**:
1. Verificar que las variables de entorno estén correctas
2. Verificar que la base de datos esté activa
3. Verificar que el host permita conexiones externas
4. Revisar logs del backend

### Error: "CORS policy"

**Solución**:
1. Verificar que `FRONTEND_URL` en el backend sea correcta
2. Verificar configuración de CORS en `index.cjs`
3. Asegurarse de usar HTTPS en producción

### Error: "Build failed"

**Solución**:
1. Verificar que todas las dependencias estén en `package.json`
2. Verificar que no haya errores de sintaxis
3. Revisar logs de build en el dashboard

### El frontend no se conecta al backend

**Solución**:
1. Verificar `VITE_BACKEND_URL` en variables de entorno
2. Verificar que el backend esté desplegado y funcionando
3. Verificar CORS en el backend
4. Revisar consola del navegador para errores

---

## 📞 Recursos Adicionales

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Supabase Docs**: https://supabase.com/docs

---

## ✅ Checklist Final para la Presentación

- [ ] Backend desplegado y funcionando
- [ ] Frontend desplegado y funcionando
- [ ] Base de datos conectada
- [ ] Dominio configurado (opcional)
- [ ] SSL/HTTPS activo
- [ ] Datos de prueba cargados
- [ ] Todas las funcionalidades probadas
- [ ] Documentación lista
- [ ] Credenciales de acceso preparadas
- [ ] Demo preparada

---

**¡Listo para impresionar a ServiCollantas! 🚀**

Si necesitas ayuda con algún paso específico, no dudes en preguntar.

