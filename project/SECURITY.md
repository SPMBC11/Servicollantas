# 🔒 Documentación de Seguridad

## Medidas de Seguridad Implementadas

### 1. Headers HTTP Seguros (Helmet)
- Previene X-Frame-Options clickjacking
- Desactiva X-Powered-By header
- Configura Content Security Policy
- Previene MIME type sniffing

```javascript
app.use(helmet());
```

### 2. Rate Limiting

#### Global (100 solicitudes por 15 minutos)
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

#### Endpoint de Login (5 intentos por 15 minutos)
```javascript
app.post("/api/login", loginLimiter, ...)
```

### 3. Autenticación JWT
- Tokens con expiración de 8 horas
- Secreto seguro en variables de entorno
- Validación en cada request protegido

### 4. Hashing de Contraseñas
```javascript
const hashed = bcrypt.hashSync(password, 10);
```

### 5. CORS Configurado
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};
```

### 6. Validación de Entrada
- Express-validator para validar datos
- Sanitización de inputs
- Verificación de tipos

## Variables de Entorno Críticas

```bash
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=servicollantas
DB_USER=postgres
DB_PASSWORD=<STRONG_PASSWORD>

# Servidor
PORT=4000
JWT_SECRET=<LONG_RANDOM_STRING>
NODE_ENV=production

# CORS
FRONTEND_URL=https://yourdomain.com
```

## Checklist de Seguridad para Producción

- [ ] JWT_SECRET es único y seguro (mínimo 32 caracteres)
- [ ] DB_PASSWORD es fuerte
- [ ] NODE_ENV=production
- [ ] FRONTEND_URL apunta a dominio correcto
- [ ] HTTPS habilitado
- [ ] CORS restrictivo
- [ ] Rate limiting activo
- [ ] Logs de auditoría habilitados
- [ ] Backup automático de BD
- [ ] Monitoreo de errores (Sentry)

## Vulnerabilidades Conocidas

Ejecuta regularmente:
```bash
npm audit
npm audit fix
```

## Manejo de Errores Sensibles

Nunca exponer:
```javascript
// ❌ MAL - Expone detalles internos
res.status(500).json({ error: err.message, stack: err.stack });

// ✅ BIEN - Mensaje genérico
res.status(500).json({ 
  error: 'Internal server error',
  requestId: req.id 
});
```

## Logging y Auditoría

Todos los requests se loguean con timestamp:
```
[2025-12-18T10:30:45.123Z] POST /api/login - 200 - 45ms
[2025-12-18T10:30:50.456Z] GET /api/clients/1 - 403 - 12ms
```

## Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
