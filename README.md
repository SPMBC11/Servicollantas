# Servicollantas 

Aplicación web para la gestión de una serviteca (taller automotriz) que permite administrar clientes, vehículos, mecánicos, citas y el rendimiento del taller.

## Tecnologías

- Frontend: React + TypeScript
- Backend: Node.js (TypeScript)
- Estilos: CSS / librerías UI según el proyecto
- Otros: Dockerfile y scripts de despliegue

## Funcionalidades principales

### Módulo de autenticación y roles
- Registro e inicio de sesión de usuarios.
- Roles de usuario: administrador, cliente y mecánico.
- Control de acceso a vistas según el rol.

### Módulo de clientes y vehículos
- Registro y edición de clientes.
- Registro de vehículos asociados a cada cliente.
- Los clientes visualizan sus vehículos por referencia (sin mostrar la placa); la placa solo es visible para el administrador.

### Módulo de mecánicos
- Registro de mecánicos con sus datos de contacto y especialidad.
- Gestión de estado (activo/inactivo).
- Asignación de mecánicos a citas/servicios.
- Panel de rendimiento por mecánico (órdenes completadas, calificación promedio, etc.).

### Módulo de citas y servicios
- Creación de citas por parte de los clientes.
- Selección de mecánico para la cita (cuando aplique).
- Visualización de citas:
  - Clientes: sus propias citas.
  - Mecánicos: citas asignadas.
  - Administrador: todas las citas, con filtros.
- Actualización de estado de la cita (pendiente, en progreso, completada, cancelada).

### Dashboard y reportes
- Dashboard general con KPIs del taller (citas del día, servicios completados, calificaciones, etc.).
- Dashboard de mecánicos con métricas de rendimiento individuales.
- Vista de desempeño accesible para administrador y mecánicos.

## Estructura del proyecto

Servicollantas/
├── project/ # Código principal del proyecto
│ ├── frontend/ # Aplicación React (si está separada)
│ ├── backend/ # API Node.js (si está separada)
│ └── ... # Resto de código fuente
├── package-lock.json
└── README.md

text

> Nota: Ajusta esta estructura según las carpetas reales (`src/`, `server/`, etc.).

## Requisitos previos

- Node.js (versión recomendada: XX)
- npm o yarn
- (Opcional) Docker, si se usa el Dockerfile para despliegue

## Instalación y ejecución

Clonar el repositorio
git clone https://github.com/SPMBC11/Servicollantas.git
cd Servicollantas

Instalar dependencias
npm install

Ejecutar en modo desarrollo
npm run dev

(Opcional) construir para producción
npm run build

text

> Completa los scripts reales (`npm run server`, `npm run client`, etc.) según tu configuración.

## Despliegue

- El proyecto está preparado para desplegarse en servicios que soporten aplicaciones Node + React.
- Se puede usar un servidor con Node.js, o plataformas como Render / Railway para el backend y Vercel / Netlify para el frontend (según la configuración elegida).

## Licencia

Proyecto/ empresarial para Serpicolllantas (Serviteca Viteca). El uso y redistribución dependen de los acuerdos con la empresa.