# AgroData

Sistema de gestión cooperativa agrícola. Monorepo basado en **npm workspaces** que comparte una sola base de datos entre la web, el API y las futuras aplicaciones móviles.

## Estructura

```
AgroData/
├── package.json           # Raíz: workspaces + scripts (un solo npm install / npm run dev)
├── apps/
│   ├── api/               # Backend API (Express + TypeScript + Prisma) → puerto 5000
│   └── web/               # Frontend web (React + Vite + Tailwind) → puerto 5173
└── packages/
    └── database/          # Fuente única: schema Prisma, migraciones y seed
```

## Requisitos

- Node.js >= 18.x
- MySQL instalado y ejecutándose

## Primer uso

```bash
# 1. Configurar credenciales de BD
#    En packages/database/.env  → DATABASE_URL="mysql://usuario:pass@localhost:3306/agrodata"
#    En apps/api/.env           → PORT, JWT_SECRET, DATABASE_URL, FRONTEND_URL

# 2. Instalar TODO el proyecto desde la raíz (un solo comando)
npm install

# 3. Crear/aplicar la BD y sembrar datos de prueba
npm run db:reset -- --force   # o bien: npm run db:migrate y npm run db:seed
```

## Uso diario

```bash
npm run dev        # Levanta API (5000) y web (5173) a la vez
```

### Scripts disponibles

| Script raíz | Descripción |
|---|---|
| `npm run dev` | Levanta API y web simultáneamente |
| `npm run build` | Compila API y web |
| `npm run lint` | Typecheck del API y lint del web |
| `npm run db:migrate` | Ejecuta migraciones |
| `npm run db:generate` | Regenera el Prisma Client (compartido en la raíz) |
| `npm run db:seed` | Siembra datos de prueba |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run db:reset` | Resetea BD y aplica migraciones + seed |
| `npm run db:push` | Sincroniza esquema sin migraciones |

## Datos de prueba (seed)

| Email | Password | Rol |
|---|---|---|
| admin@agrodata.com | Admin123! | ADMIN |
| carlos.mendoza@agrodata.com | Demo123! | USER |
| maria.garcia@agrodata.com | Demo123! | USER |

## Notas de arquitectura

- El modelo de datos vive en `packages/database` y es la **única fuente de verdad** (schema + migraciones). Todos los consumidores (API, web, móviles futuros) comparten la misma base de datos a través del API.
- El Prisma Client se genera en el `node_modules` raíz y es compartido por todos los workspaces.
- Para añadir una app móvil, crea una carpeta nueva en `apps/` (ej. `apps/mobile`) y agrégala a `workspaces` en el `package.json` raíz.
