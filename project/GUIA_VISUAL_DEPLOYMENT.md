# 🎬 GUÍA VISUAL: DEPLOY EN 15 MINUTOS

> **Tu repositorio:** https://github.com/SPMBC11/Servicollantas.git  
> **Estado:** ✅ Todo listo para deployment

---

## 📱 PASO 1: FRONTEND EN VERCEL (8 minutos)

### 1️⃣ Abre este enlace
```
https://vercel.com/new
```

### 2️⃣ Conecta GitHub
```
Button: "Continue with GitHub"
↓
Autoriza Vercel
↓
Busca: "Servicollantas"
↓
Click en "Import"
```

### 3️⃣ Configurar proyecto

Vercel detectará automáticamente:
```
Framework:           Vite ✅
Root Directory:      /frontend ✅  
Build Command:       npm run build ✅
Output Directory:    dist ✅
```

**NO CAMBIES NADA** - Vercel lo hace automáticamente

### 4️⃣ Environment Variables

Dejar VACÍO por ahora (no necesitas variables para demostración)

Click en **"Deploy"**

⏳ **Espera 2-3 minutos...**

✅ **RESULTADO:** 
```
URL: https://servi-collantas.vercel.app
(o algo parecido)
```

**Guarda esta URL** ← La necesitas después

---

## 🔌 PASO 2: BACKEND EN RENDER (5 minutos)

### 1️⃣ Abre este enlace
```
https://dashboard.render.com
```

### 2️⃣ Conecta GitHub
```
Button: "New +" (arriba a la derecha)
↓
Select: "Web Service"
↓
Button: "Connect GitHub Account"
↓
Autoriza Render
↓
Busca: "Servicollantas"
↓
Click en "Connect"
```

### 3️⃣ Configurar el servicio

```
Name:                  servi-collantas-api
Environment:           Node
Region:                (elige la más cercana)
Branch:                main
Root Directory:        /backend
Build Command:         npm install
Start Command:         npm start
```

**IMPORTANTE:** En `package.json` del backend verifica que `npm start` funciona

### 4️⃣ Agregar Variables de Entorno

Click en **"Environment"** en el formulario

Copia y pega EXACTAMENTE esto:

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=servi_collantas_db
DB_PORT=5432
JWT_SECRET=tu_secreto_super_seguro_2024_cambiar_despues
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://servi-collantas.vercel.app
```

### 5️⃣ Deploy

Click en **"Deploy Web Service"**

⏳ **Espera 3-5 minutos...**

✅ **RESULTADO:**
```
URL: https://servi-collantas-api.onrender.com
(o similar)
```

**Guarda esta URL también** ← La necesitas ahora

---

## 🔗 PASO 3: CONECTAR FRONTEND CON BACKEND (2 minutos)

### En Vercel Dashboard:

```
1. Ve a: https://vercel.com/dashboard
2. Click en tu proyecto "servi-collantas"
3. Tab: "Settings"
4. Sección: "Environment Variables"
5. Click: "Add New"
```

Agrega esta variable:
```
Name:    VITE_API_URL
Value:   https://servi-collantas-api.onrender.com
```

### Redeploy

```
6. Tab: "Deployments"
7. Arriba a la derecha, click en los 3 puntos (...)
8. Select: "Redeploy"
9. Click: "Redeploy"
```

⏳ **Espera 1 minuto**

---

## ✅ PASO 4: PROBAR QUE FUNCIONA

### Abre tu app:
```
https://servi-collantas.vercel.app
```

### Credenciales de prueba:
```
Email:    admin@servicollantas.com
Password: admin123
```

### Qué probar:
```
✅ Login (debe funcionar)
✅ Dashboard (ver datos)
✅ Crear un cliente (agregar nuevo)
✅ Crear un servicio (agregar nuevo)
✅ Crear una cita (agendar)
✅ Ver facturas (generar PDF)
```

### Si algo no funciona:
```
1. Abre "Developer Tools" (F12)
2. Tab: "Network"
3. Mira si tienes errores de API
4. Copia el error y te ayudo
```

---

## 🎁 URLS FINALES PARA TU CLIENTE

Copia esto y envía a tu cliente:

```
═════════════════════════════════════════════════

🎉 SERVI-COLLANTAS ESTÁ EN PRODUCCIÓN

🌐 Accede aquí:
https://servi-collantas.vercel.app

👤 Credenciales de prueba:
   Email:    admin@servicollantas.com
   Password: admin123

📱 Funcionalidades:
   ✅ Gestión de clientes
   ✅ Gestión de mecánicos
   ✅ Agendar citas
   ✅ Crear servicios
   ✅ Generar facturas
   ✅ Reportes y análisis

⏱️ Nota: El primer acceso toma 30 segundos (servidor en standby)

═════════════════════════════════════════════════
```

---

## 🆘 TROUBLESHOOTING

### "La página no carga"
```
1. Verifica que ambas URLs estén activas:
   - https://servi-collantas.vercel.app
   - https://servi-collantas-api.onrender.com
   
2. Abre esta URL en el navegador:
   https://servi-collantas-api.onrender.com/api/services
   
3. Si ves JSON → Backend funciona
   Si no → Espera 2 minutos (Render tarda en iniciar)
```

### "Login no funciona"
```
1. Abre Developer Tools (F12)
2. Tab: Network
3. Intenta login nuevamente
4. Busca la solicitud a /login
5. Mira el error exacto

Probable causa: Base de datos no existe en Render
Solución: Necesitamos migrar PostgreSQL (Paso 5)
```

### "El servidor dice que está en pausa (Render)"
```
Los servidores gratuitos de Render se pausan después de 
15 minutos sin uso. Es normal.

Solución: Click en la URL → Espera 30 segundos
El servidor se reinicia automáticamente.
```

---

## 📊 ESTADO DE DEPLOYMENT

| Servicio | Estado | URL |
|----------|--------|-----|
| Frontend (Vercel) | 🟢 Listo | https://vercel.com/dashboard |
| Backend (Render) | 🟡 Configurando | https://dashboard.render.com |
| Base de Datos | ❌ Falta | Ver "PASO 5" |

---

## 📋 PASO 5 (OPCIONAL): BASE DE DATOS EN PRODUCCIÓN

Sin esto, el login funciona pero no puedes guardar datos.

### Opción A: Railway (Más fácil)
```
1. Ve a: https://railway.app
2. Sign up con GitHub
3. New Project
4. Add → PostgreSQL
5. Copia las credenciales
6. Actualiza variables en Render
```

### Opción B: Render PostgreSQL
```
En Render dashboard:
1. New → PostgreSQL
2. Copia el "Internal Database URL"
3. Usa como DB_URL en backend
```

### Opción C: Después
```
Puedes dejar esto para después.
La app funciona sin persistencia temporal.
```

---

## ⏱️ RESUMEN TIMELINE

```
Ahora (< 5 min):     Vercel deployment iniciado
En 3 minutos:        Frontend en vivo
En 5 minutos:        Render deployment iniciado
En 8 minutos:        Backend conectado
En 15 minutos:       TODO FUNCIONANDO ✅
```

---

## 🚀 SIGUIENTE: Mostrar al cliente

Una vez todo funcione:

```bash
1. Abre https://servi-collantas.vercel.app
2. Haz login con admin@servicollantas.com
3. Muestra funcionalidades
4. Pregunta si quiere cambios
5. Si dice "sí" → Haz cambios en local
6. Push a GitHub → Deploy automático en 2 minutos
```

---

**¿Dudas en algún paso? Dime cuál y te ayudo!** 💪

Documento creado: 26 Diciembre 2025
