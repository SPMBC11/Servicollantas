# 🔐 GUÍA RÁPIDA DE SEGURIDAD - ServiCollantas

## ⚡ Lo más importante (3 minutos)

### 🚫 NUNCA hagas esto:
```bash
# ❌ NO COMMITAR ESTOS ARCHIVOS
.env
.env.local
cypress.env.json
cualquier archivo con passwords/secrets
```

### ✅ SIEMPRE haz esto:
```bash
# 1. Copiar archivo de ejemplo
cp backend/.env.example backend/.env

# 2. Editar con TUS valores locales
nano backend/.env
# Agregar:
# DB_PASSWORD=micontraseña
# JWT_SECRET=unsecretomunylargo

# 3. VERIFICAR que no está commiteado
git status  # No debe aparecer .env

# 4. Usar la contraseña de mecánico solo al CREAR
# NO intentes regenerarla después
```

---

## 🔑 Manejo de Secretos

### Variables de entorno requeridas
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=servicollantas
DB_USER=postgres
DB_PASSWORD=aqui-va-tu-contrasena  ⚠️ Nunca sharee esto

# JWT
JWT_SECRET=unsecreto-muy-largo-32-caracteres  ⚠️ Generar nuevo
JWT_EXPIRES_IN=8h

# Server
PORT=4000
NODE_ENV=development  # production en produc.
```

### Generar JWT_SECRET seguro
```bash
# Opción 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opción 2: OpenSSL
openssl rand -hex 32

# Opción 3: Python
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## 👤 Mecánico - Gestión de Contraseña

### Flujo CORRECTO ✅
```
1. Admin crea mecánico
   └─ Se genera contraseña aleatoria AUTOMÁTICAMENTE
   └─ Admin ve la contraseña UNA SOLA VEZ
   └─ Admin envía al mecánico (Email, WhatsApp, etc)

2. Mecánico accede por primera vez
   └─ Usa las credenciales recibidas
   └─ Se le pide cambiar contraseña

3. Mecánico olvida contraseña
   └─ Click en "¿Olvidaste tu contraseña?"
   └─ Recibe reset link por email
   └─ Crea nueva contraseña

4. Admin quiere reenviar credenciales
   └─ Puede ver email del mecánico
   └─ Si mecánico olvidó: Reseta su password
   └─ NO regenera automáticamente
```

### Flujo INCORRECTO ❌
```
❌ NO hacer que se regenere contraseña cada vez que:
  - Admin mira el perfil del mecánico
  - Admin hace clic en "enviar credenciales"
  - Se obtiene información del mecánico
```

---

## 🔍 Verificar antes de hacer push

```bash
# 1. Ver qué archivos van a subirse
git status

# 2. NUNCA debes ver:
# .env
# .env.local
# cypress.env.json
# check-password.js
# verify-hash.js

# 3. Si los ves, hacer:
git rm --cached .env          # Remover del staging
echo ".env" >> .gitignore     # Agregar a gitignore
git commit -m "Remove .env from tracking"
```

---

## 🆘 Si accidentalmente commitaste secretos

```bash
# 1. STOP - No hagas push
# 2. Cambiar TODOS los secretos (contraseñas, tokens, etc)
# 3. Hacer:
git rm --cached .env
git commit --amend         # Enmendar último commit
git push --force-with-lease

# 4. Si ya hizo push:
# - Notificar al equipo
# - Usar BFG Repo-Cleaner o git filter-branch
# - Cambiar TODOS los secretos en producción
```

---

## 📚 Archivos importantes

- [SECURITY_FIXES.md](./SECURITY_FIXES.md) - Documentación completa de seguridad
- [SECURITY_REMEDIATION_SUMMARY.md](./SECURITY_REMEDIATION_SUMMARY.md) - Resumen de acciones tomadas
- [backend/.env.example](./backend/.env.example) - Template de variables de entorno
- [frontend/cypress.env.example](./frontend/cypress.env.example) - Template de credenciales de testing
- [.gitignore](./.gitignore) - Archivos que nunca se suben

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo guardar mi .env en Dropbox/Google Drive?**  
R: ✅ SÍ, es más seguro que en el repo

**P: ¿Puedo compartir .env por Slack?**  
R: ❌ NO, usar Vault/1Password/LastPass

**P: ¿Cuándo cambio JWT_SECRET?**  
R: Solo cuando hay vulnerabilidad o cambio de servidor

**P: ¿Las contraseñas de mecánico se cambian solos?**  
R: ❌ NO, solo al crear. Si olvidan, deben resetear

**P: ¿Puedo usar "admin123" como contraseña?**  
R: ❌ NO en producción. Usar >= 12 caracteres

**P: ¿Dónde guardo secretos en producción?**  
R: Azure Secrets / AWS Secrets Manager / 1Password

---

## 🚀 Deploy Checklist

- [ ] Copié `.env.example` a `.env`
- [ ] Llenarón valores REALES en `.env`
- [ ] `.env` está en `.gitignore`
- [ ] `git status` NO muestra `.env`
- [ ] JWT_SECRET es long y seguro (32+ chars)
- [ ] DB_PASSWORD es strong (12+ chars)
- [ ] NODE_ENV está correcto (dev/production)
- [ ] Probé crear un mecánico y se generó contraseña
- [ ] Comprobé que contraseña NO se regenera al ver mecánico
- [ ] Rate limiting está activo

---

**Last Updated**: 26 Diciembre 2025  
**Por**: GitHub Copilot  
**Versión**: 1.0 - SEGURIDAD VERIFICADA ✅
