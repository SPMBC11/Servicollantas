# 🚀 Inicio Rápido - ServiCollantas

## Opción 1: Con Docker (Recomendado)

```bash
# 1. Iniciar PostgreSQL y la aplicación
docker-compose up -d

# 2. Verificar que todo esté funcionando
# Backend: http://localhost:4000
# Frontend: http://localhost:5173
```

## Opción 2: Instalación Manual

### 1. Configurar PostgreSQL
```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE servicollantas;
\q

# O usar Docker solo para PostgreSQL
docker run --name servicollantas-db \
  -e POSTGRES_DB=servicollantas \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Instalar y ejecutar
```bash
# Backend
cd src/server
npm install
npm run dev

# Frontend (en otra terminal)
npm install
npm run dev
```

## 🔑 Credenciales de Acceso

- **Administrador**: admin@servicollantas.com / 

- **Mecánico**: mechanic@servicollantas.com / mechanic123

## 📱 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/api/health

## 🛠️ Comandos Útiles

```bash
# Probar conexión a la base de datos
node test-database.js

# Iniciar en modo desarrollo (Windows)
start-dev.bat

# Iniciar en modo desarrollo (Linux/Mac)
./start-dev.sh

# Detener Docker
docker-compose down

# Ver logs
docker-compose logs -f
```

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL
```bash
# Verificar que PostgreSQL esté ejecutándose
docker ps | grep postgres

# Reiniciar contenedor
docker restart servicollantas-db
```

### Error de permisos
```bash
# Dar permisos al script (Linux/Mac)
chmod +x start-dev.sh
```

### Puerto ocupado
```bash
# Cambiar puertos en docker-compose.yml
# O detener procesos que usen los puertos 4000/5173
```

## ✅ Verificación

1. Abrir http://localhost:5173
2. Hacer clic en "Reservar Cita"
3. Completar el proceso de reserva
4. Verificar que se envía mensaje por WhatsApp
5. Iniciar sesión como admin para ver la cita

¡Listo! Tu sistema ServiCollantas está funcionando. 🎉
