# AgroData - Backend API

Sistema de gestión cooperativa agrícola. Backend construido con Node.js, Express, TypeScript, Prisma y MySQL.

## Requisitos previos

- Node.js >= 18.x
- MySQL instalado y ejecutándose
- npm o yarn

## Instalación

Este proyecto usa **npm workspaces** (ver README raíz). Todo se instala y ejecuta desde la raíz.

### 1. Base de datos (desde la raíz del monorepo)

```bash
npm install

# Configurar la conexión en packages/database/.env
# DATABASE_URL="mysql://usuario:password@localhost:3306/agrodata"

# Ejecutar migraciones
npm run db:migrate

# Sembrar datos de prueba
npm run db:seed

# Opcional: Abrir Prisma Studio para ver la BD
npm run db:studio
```

### 2. Backend (desde la raíz del monorepo)

```bash
# Configurar variables de entorno en apps/api/.env
# (ver sección Configuración)

# Ejecutar en desarrollo (levanta API y web a la vez)
npm run dev

# O solo este workspace
npm run dev -w @agrodata/api

# Compilar para producción
npm run build
```

## Configuración (.env)

### packages/database/.env
```
DATABASE_URL="mysql://root:@localhost:3306/agrodata"
```

### apps/api/.env
```
PORT=3000
NODE_ENV=development
JWT_SECRET=tu-clave-secreta-super-segura-aqui
JWT_EXPIRES_IN=24h
DATABASE_URL="mysql://root:@localhost:3306/agrodata"
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

### Health Check
- `GET /api/health` - Verificar estado del servidor

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere token)

### Usuarios (requieren autenticación)
- `GET /api/usuarios` - Listar todos los usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario (solo admin)

## Ejemplos de Request/Response

### POST /api/auth/register
```json
// Request
{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "miPassword123"
}

// Response 201
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "rol": "USER",
      "activo": true
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### POST /api/auth/login
```json
// Request
{
  "email": "admin@agrodata.com",
  "password": "Admin123!"
}

// Response 200
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "Administrador",
      "email": "admin@agrodata.com",
      "rol": "ADMIN",
      "activo": true
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### GET /api/usuarios
```
Headers: Authorization: Bearer <token>

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Administrador",
      "email": "admin@agrodata.com",
      "rol": "ADMIN",
      "activo": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

### PUT /api/usuarios/:id
```json
// Request
{
  "nombre": "Juan Pérez Actualizado",
  "rol": "ADMIN"
}

// Response 200
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": { ... }
}
```

## Datos de Prueba (Seed)

| Email | Password | Rol |
|---|---|---|
| admin@agrodata.com | Admin123! | ADMIN |
| carlos.mendoza@agrodata.com | Demo123! | USER |
| maria.garcia@agrodata.com | Demo123! | USER |

## Estructura del Backend

```
apps/api/
├── src/
│   ├── config/          # Configuración (DB, env vars)
│   ├── controllers/     # Controladores de la API
│   ├── middleware/       # Auth, validación, errores
│   ├── models/          # (Prisma genera los modelos)
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── validators/      # Schemas de validación Joi
│   ├── app.ts           # Configuración Express
│   └── server.ts        # Entry point
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

Nota: el schema Prisma y las migraciones viven en `packages/database/`, que es la fuente única del modelo de datos.

## Comandos Útiles (desde la raíz del monorepo)

```bash
npm run db:migrate    # Ejecutar migraciones
npm run db:seed       # Sembrar datos
npm run db:studio     # Abrir Prisma Studio
npm run db:reset      # Resetear base de datos

npm run dev           # Levanta API y web con hot-reload
npm run build         # Compilar TypeScript
npm run lint          # Verificar tipos
```
