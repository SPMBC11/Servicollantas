# 🔒 Configuración de Variables de Entorno (NO Incluidas en Git)

## ⚠️ IMPORTANTE - Seguridad

Los archivos `.env` contienen información sensible como:
- Contraseñas de base de datos
- Números de teléfono de WhatsApp
- Secretos JWT
- Credenciales de servicios

**Estos archivos NUNCA deben subirse a GitHub.** Están incluidos en `.gitignore`.

## 📋 Configuración Requerida

### Backend (`backend/.env`)

Crea el archivo `backend/.env` con estas variables:

```dotenv
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=servicollantas
DB_USER=postgres
DB_PASSWORD=SPMBarcelona11

# Configuración del Servidor
PORT=4000
JWT_SECRET=dev-secret-servi-collantas-2025

# Configuración de WhatsApp
WHATSAPP_PHONE=573053113534
```

### Frontend (`frontend/.env`)

Crea el archivo `frontend/.env` con esta variable:

```dotenv
VITE_API_BASE_URL=http://localhost:4000
```

## ✅ Verificación

Para asegurarte de que todo está configurado correctamente:

1. El archivo `.gitignore` debe contener:
   ```
   .env
   .env.local
   .env.*.local
   backend/.env
   frontend/.env
   frontend/.env.local
   ```

2. Ejecutar: `git status` debe mostrar que los `.env` NO aparecen en los cambios

3. Si accidentalmente se suben, ver la sección "Si ya subiste datos sensibles a GitHub" más abajo

## 🚨 Si ya subiste datos sensibles a GitHub

Si accidentalmente has subido un `.env` con información sensible:

1. **Cambia inmediatamente todas tus contraseñas y tokens**
2. **Regenera tus secretos JWT**
3. **Notifica al servicio de WhatsApp si es necesario**
4. Usa BFG Repo-Cleaner para eliminar el archivo del historio:
   ```bash
   brew install bfg  # macOS/Linux
   # o descarga de https://rtyley.github.io/bfg-repo-cleaner/
   
   bfg --delete-files backend/.env
   git reflog expire --expire=now --all && git gc --prune=now --aggressive
   git push origin --force
   ```

## 📝 Variables Necesarias por Entorno

### Desarrollo Local
- Usa los valores por defecto en los archivos `.env.example`
- Personaliza solo si es diferente a `localhost:4000`

### Producción
- Configura todas las variables con valores reales
- NUNCA commits `.env` a version control
- Usa secrets del hosting (Vercel, Render, Heroku, etc.)

## 🔑 Mejores Prácticas

✅ **Hacer:**
- Mantener `.env` en `.gitignore`
- Crear `.env.example` con valores placeholder
- Documentar todas las variables requeridas
- Usar diferentes secretos en dev/staging/prod

❌ **No hacer:**
- Hacer commit de `.env`
- Compartir tokens/contraseñas en código
- Usar los mismos secretos en todos los entornos
- Hardcodear valores sensibles en el código

