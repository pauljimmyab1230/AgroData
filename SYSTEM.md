# AgroData — Documentación Completa del Sistema

## 1. Visión General

**AgroData** es un sistema de gestión cooperativa agrícola diseñado para administrar el ciclo productivo completo: desde la planificación de campañas y el registro de productores, hasta el acopio, procesamiento, inventario y trazabilidad de productos agrícolas.

### Arquitectura

```
AgroData/
├── package.json               # Raíz: npm workspaces
├── apps/
│   ├── api/                   # Backend (Express + TypeScript + Prisma) → Puerto 5000
│   └── web/                   # Frontend (React + Vite + Tailwind) → Puerto 5173
└── packages/
    └── database/              # Fuente única de verdad (schema Prisma + migraciones + seed)
```

**Patrón**: Monorepo con **npm workspaces**. La base de datos se comparte a través del API entre todas las aplicaciones (web actual, móviles futuros).

---

## 2. Stack Tecnológico

### Backend (`apps/api`)
| Componente | Tecnología |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Lenguaje | TypeScript |
| ORM | Prisma Client |
| DB | MySQL |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Validación | Joi |
| Seguridad | Helmet, CORS |
| Logging | Morgan |
| Upload | Multer |

### Frontend (`apps/web`)
| Componente | Tecnología |
|---|---|
| Framework | React 19 |
| Bundler | Vite 8 |
| Estilos | Tailwind CSS 4 |
| Rutas | React Router DOM 7 |
| State | Zustand |
| Server State | TanStack React Query |
| HTTP Client | Axios |
| Mapas | Leaflet + React-Leaflet |
| Geometría | Turf.js (@turf/area, @turf/length) |
| Iconos | Lucide React, React Icons |

### Base de Datos (`packages/database`)
| Componente | Tecnología |
|---|---|
| ORM | Prisma 6.10 |
| DB | MySQL |
| Seed | tsx |

---

## 3. Modelado de Datos

### 3.1 Diagrama de Entidades

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────────┐
│  usuarios    │     │   productores    │────▶│ familiares_       │
│  (auth)      │     │   (core)         │     │ productor         │
└──────┬───────┘     └───────┬──────────┘     └───────────────────┘
       │                     │
       │              ┌──────┴──────────────────┐
       │              │                          │
       │    ┌─────────▼─────────┐     ┌─────────▼─────────┐
       │    │ parcelas_productor │     │ documentos_       │
       │    │ (georreferenciada)│     │ productor         │
       │    └─────────┬─────────┘     └───────────────────┘
       │              │
       │    ┌─────────▼─────────┐
       │    │    cultivos       │
       │    │ (por campaña)     │
       │    └─────────┬─────────┘
       │              │
┌──────▼───────┐     ┌▼─────────────┐     ┌──────────────────┐
│  campanias   │◀────│ actividades  │     │  acopios         │
│  (ciclo)     │     └──────┬───────┘     └──────┬───────────┘
└──────┬───────┘            │                     │
       │              ┌─────┴───────┐       ┌─────▼───────────┐
       │              │ insumos     │       │ acopio_sacos    │
       │              │ mano_obra   │       │ acopio_fotos    │
       │              │ maquinaria  │       └──────┬──────────┘
       │              │ fotos       │              │
       │              └─────────────┘              │
       │                                          │
       │    ┌─────────────────┐              ┌────▼────────────┐
       ├────│  inspecciones   │              │  recepciones    │
       │    └────────┬────────┘              └────┬────────────┘
       │             │                            │
       │    ┌────────┴────────┐              ┌────▼────────────┐
       │    │ checklist       │              │  procesamientos │
       │    │ no_conformidades│              └────┬────────────┘
       │    │ accionescorr.   │                   │
       │    │ evidencias      │              ┌────┴────────────┐
       │    │ historial       │              │ lotes           │
       │    └─────────────────┘              │ operaciones     │
       │                                     │ evidencias      │
       │    ┌─────────────────┐              │ historial       │
       ├────│    lotes        │              └─────────────────┘
       │    └────────┬────────┘
       │             │
       │    ┌────────▼────────┐     ┌──────────────────┐
       │    │ lote_movimientos│     │   inventario     │
       │    └─────────────────┘     └──────┬───────────┘
       │                                    │
       │                           ┌────────▼───────────┐
       │                           │ inventario_        │
       │                           │ movimientos        │
       │                           └────────────────────┘
       │
       │    ┌─────────────────┐
       └────│  trazabilidad   │
            └────────┬────────┘
                     │
            ┌────────▼────────┐
            │ trazabilidad_   │
            │ eventos         │
            └─────────────────┘
```

### 3.2 Modelos Principales

#### `usuarios`
Gestión de usuarios del sistema con autenticación JWT.

| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Identificador único |
| nombre | VARCHAR(100) | Nombre completo |
| email | VARCHAR(150) | Email único |
| password | VARCHAR(255) | Hash bcrypt |
| rol | ENUM | ADMIN / USER |
| activo | BOOLEAN | Estado de cuenta |

#### `productores`
Registro maestro de productores agrícolas cooperativistas.

| Campo | Tipo | Descripción |
|---|---|---|
| codigo | VARCHAR(20) | Código único del productor |
| dni | VARCHAR(8) | Documento de identidad |
| nombres / apellido_paterno / apellido_materno | VARCHAR | Datos personales |
| sexo | ENUM | MASCULINO / FEMENINO |
| fecha_nacimiento | DATE | Fecha de nacimiento |
| estado_civil | ENUM | SOLTERO / CASADO / CONVIVIENTE / VIUDO |
| departamento / provincia / distrito / comunidad | VARCHAR | Ubicación |
| nivel_educativo | ENUM | SIN_ESTUDIOS / PRIMARIA / SECUNDARIA / TECNICO / UNIVERSITARIO |
| idioma_principal | ENUM | QUECHUA / ESPANOL / OTRO / NINGUNO |
| estado | ENUM | ACTIVO / INACTIVO / SUSPENDIDO |
| cargo | ENUM | SOCIO / DIRECTIVO / PRESIDENTE / etc. |

Relaciones: `familiares`, `parcelas`, `documentos`, `cultivos`, `actividades`, `inspecciones`, `acopios`

#### `parcelas_productor`
Parcelas georreferenciadas asociadas a cada productor.

| Campo | Tipo | Descripción |
|---|---|---|
| codigo | VARCHAR(20) | Código único |
| nombre | VARCHAR(200) | Nombre de la parcela |
| area | DECIMAL(10,2) | Superficie |
| area_unidad | VARCHAR(10) | Unidad (ha, m²) |
| latitud / longitud | VARCHAR(30) | Coordenadas GPS |
| poligono | JSON | Vértices del polígono (GeoJSON) |
| tipo_suelo / textura / pendiente | VARCHAR | Características del suelo |
| fuente_agua / sistema_riego | VARCHAR | Infraestructura |
| certificacion | ENUM | ORGANICA / EN_TRANSICION / CONVENCIONAL |
| estado | ENUM | ACTIVA / INACTIVA |

Relaciones: `documentos`, `fotos`, `cultivos`, `actividades`, `inspecciones`, `acopios`

#### `campanias`
Campañas agrícolas que agrupan todo el ciclo productivo.

| Campo | Tipo | Descripción |
|---|---|---|
| codigo | VARCHAR(20) | Código único |
| nombre | VARCHAR(200) | Nombre de campaña |
| anio_agricola | VARCHAR(10) | Ej: "2025-2026" |
| fecha_inicio / fecha_fin | DATE | Periodo |
| estado | ENUM | PLANIFICADA / ACTIVA / FINALIZADA / CANCELADA |
| responsable / tecnico_coordinador | VARCHAR | Personal a cargo |
| permitir_* | BOOLEAN | Flags de permisos por módulo |

Relaciones: `cultivos`, `actividades`, `inspecciones`, `acopios`, `recepciones`, `procesamientos`, `lotes`

#### `cultivos`
Registro de cultivos por campaña, productor y parcela.

| Campo | Tipo | Descripción |
|---|---|---|
| codigo | VARCHAR(20) | Código único |
| cultivo / variedad | VARCHAR | Tipo y variedad |
| area_sembrada | DECIMAL(10,2) | Superficie sembrada |
| fecha_siembra / fecha_emergencia / fecha_floracion / fecha_cosecha | DATE | Cronología |
| metodo_siembra | ENUM | DIRECTA / TRASPLANTE / ALMACIGO / OTRO |
| sistema_productivo | ENUM | AGROECOLOGICO / ORGANICO / CONVENCIONAL / EN_TRANSICION |
| tipo_agricultura | ENUM | TRADICIONAL / TECNIFICADA / MIXTA |
| certificacion | ENUM | ORGANICA / EN_TRANSICION / SIN_CERTIFICAR |
| procedencia_semilla | ENUM | CERTIFICADA / COMUN / PRODUCIDA_EN_CAMPO / CONSERVADA_POR_AGRICULTOR |
| destino_produccion | ENUM | VENTA_COOPERATIVA / COMERCIALIZACION_LOCAL / AUTOCONSUMO / SEMILLA |
| estado | ENUM | ACTIVO / EN_DESARROLLO / COSECHADO / FINALIZADO |

Relaciones: `actividades`, `inspecciones`, `acopios`

#### `actividades`
Registro de actividades agrícolas realizadas en campo.

| Campo | Tipo | Descripción |
|---|---|---|
| codigo | VARCHAR(20) | Código único |
| tipo_actividad | ENUM | PREPARACION_TERRENO / SIEMBRA / FERTILIZACION / COSECHA / etc. (17 tipos) |
| prioridad | ENUM | ALTA / MEDIA / BAJA |
| estado | ENUM | PROGRAMADA / EN_PROCESO / COMPLETADA |
| responsable_tecnico | VARCHAR(150) | Persona responsable |
| hora_inicio / hora_fin | VARCHAR(5) | Horario |
| jornales | INT | Cantidad de jornales |
| latitud / longitud / altitud | VARCHAR | Coordenadas GPS |

Sub-modelos: `actividad_insumos`, `actividad_manobra`, `actividad_maquinaria`, `actividad_fotos`

#### `inspecciones`
Inspecciones de campo con checklist, no conformidades y acciones correctivas.

| Campo | Tipo | Descripción |
|---|---|---|
| codigo | VARCHAR(20) | Código único |
| inspector | VARCHAR(150) | Nombre del inspector |
| estado | ENUM | PENDIENTE / APROBADA / NO_CONFORME |
| resultado | ENUM | CONFORME / CONFORME_CON_OBSERVACIONES / NO_CONFORME |
| riesgo_general | ENUM | BAJO / MEDIO / ALTO |
| latitud / longitud / altitud | VARCHAR | Ubicación |

Sub-modelos: `inspeccion_checklist`, `inspeccion_no_conformidades`, `inspeccion_acciones_correctivas`, `inspeccion_evidencias`, `inspeccion_historial`

#### `acopios`
Recolección de producto en campo (acopio).

| Campo | Tipo | Descripción |
|---|---|---|
| codigo | VARCHAR(20) | Código único |
| acopiador | VARCHAR(150) | Persona que acopia |
| vehiculo / ruta_acopio | VARCHAR | Logística |
| total_sacos | INT | Cantidad de sacos |
| peso_total / peso_promedio / peso_maximo / peso_minimo | DECIMAL | Pesos |
| estado | ENUM | EN_PROCESO / COMPLETADO / EN_PLANTA |
| humedad / impurezas | DECIMAL | Calidad |

Sub-modelos: `acopio_sacos`, `acopio_fotos`

#### `recepciones`
Recepción de producto en planta con control de calidad.

| Campo | Tipo | Descripción |
|---|---|---|
| codigo | VARCHAR(20) | Código único |
| planta | VARCHAR(100) | Planta de recepción |
| sacos | INT | Cantidad |
| peso_campo / peso_bruto / tara / peso_neto | DECIMAL | Pesaje |
| humedad / impurezas / materia_extrana | DECIMAL | Análisis |
| estado_producto | ENUM | EXCELENTE / BUENO / REGULAR / RECHAZADO |
| categoria | ENUM | PRIMERA / SEGUNDA / INDUSTRIAL / DESCARTE |
| destino | ENUM | PROCESAMIENTO / ALMACEN_TEMPORAL / RECHAZADO |
| resultado | ENUM | ACEPTADO / ACEPTADO_CON_OBSERVACIONES / RECHAZADO |
| estado | ENUM | PENDIENTE_PESAJE / EN_CONTROL_CALIDAD / DISPONIBLE / RECHAZADA |

Sub-modelos: `recepcion_evidencias`, `recepcion_historial`

#### `procesamientos`
Transformación del producto en planta.

| Campo | Tipo | Descripción |
|---|---|---|
| codigo | VARCHAR(20) | Código único |
| producto | VARCHAR(100) | Producto a procesar |
| planta | VARCHAR(100) | Planta |
| linea_procesamiento | ENUM | GRANOS / TUBERCULOS / LEGUMBRES / SEMILLAS |
| estado | ENUM | REGISTRADA / EN_PROCESO / COMPLETADA / PAUSADA / CANCELADA |
| peso_entrada / peso_salida / merma / rendimiento | DECIMAL | Métricas |
| calidad_producto | ENUM | PRIMERA / SEGUNDA / TERCERA / DESCARTE |

Sub-modelos: `procesamiento_lotes`, `procesamiento_operaciones`, `procesamiento_evidencias`, `procesamiento_historial`

#### `lotes`
Lotes de producto procesado.

| Campo | Tipo | Descripción |
|---|---|---|
| codigo | VARCHAR(20) | Código único |
| nombre | VARCHAR(200) | Nombre del lote |
| cultivo / origen | VARCHAR | Procedencia |
| peso_inicial / peso_disponible | DECIMAL | Cantidades |
| estado | ENUM | REGISTRADO / EN_PROCESAMIENTO / DISPONIBLE / CONSUMIDO / VENCIDO |
| fecha_produccion / fecha_vencimiento | DATE | Vigencia |

Sub-modelos: `lote_movimientos`

#### `inventario`
Control de existencias en almacén.

| Campo | Tipo | Descripción |
|---|---|---|
| codigo | VARCHAR(20) | Código único |
| producto / categoria | VARCHAR | Descripción |
| cantidad_actual / cantidad_minima / cantidad_maxima | DECIMAL | Stock |
| estado | ENUM | DISPONIBLE / RESERVADO / CONSUMIDO / VENCIDO |
| costo_unitario | DECIMAL | Costo |

Sub-modelos: `inventario_movimientos`

#### `trazabilidad`
Cadena de trazabilidad del producto desde origen hasta destino.

| Campo | Tipo | Descripción |
|---|---|---|
| codigo | VARCHAR(20) | Código único |
| producto / cultivo / origen | VARCHAR | Identificación |
| productor / parcela / comunidad | VARCHAR | Origen |
| fecha_siembra / fecha_cosecha / fecha_procesamiento | DATE | Cronología |
| peso_total | DECIMAL | Cantidad |
| calidad / certificacion | VARCHAR | Calidad |
| estado | VARCHAR | Estado actual |

Sub-modelos: `trazabilidad_eventos`

---

## 4. API REST

### 4.1 Base URL

```
http://localhost:5000/api
```

### 4.2 Endpoints

| Ruta | Método | Descripción |
|---|---|---|
| `/api/health` | GET | Health check |
| **Auth** | | |
| `/api/auth/login` | POST | Iniciar sesión |
| `/api/auth/register` | POST | Registrar usuario |
| **Usuarios** | | |
| `/api/usuarios` | GET | Listar usuarios |
| `/api/usuarios/:id` | GET | Obtener usuario |
| `/api/usuarios` | POST | Crear usuario |
| `/api/usuarios/:id` | PUT | Actualizar usuario |
| `/api/usuarios/:id` | DELETE | Eliminar usuario |
| **Productores** | | |
| `/api/productores` | GET | Listar productores |
| `/api/productores/:id` | GET | Obtener productor |
| `/api/productores` | POST | Crear productor |
| `/api/productores/:id` | PUT | Actualizar productor |
| `/api/productores/:id` | DELETE | Eliminar productor |
| **Parcelas** | | |
| `/api/parcelas` | GET | Listar parcelas |
| `/api/parcelas/:id` | GET | Obtener parcela |
| `/api/parcelas` | POST | Crear parcela |
| `/api/parcelas/:id` | PUT | Actualizar parcela |
| `/api/parcelas/:id` | DELETE | Eliminar parcela |
| **Campañas** | | |
| `/api/campanias` | GET | Listar campañas |
| `/api/campanias/:id` | GET | Obtener campaña |
| `/api/campanias` | POST | Crear campaña |
| `/api/campanias/:id` | PUT | Actualizar campaña |
| `/api/campanias/:id` | DELETE | Eliminar campaña |
| **Cultivos** | | |
| `/api/cultivos` | GET | Listar cultivos |
| `/api/cultivos/:id` | GET | Obtener cultivo |
| `/api/cultivos` | POST | Crear cultivo |
| `/api/cultivos/:id` | PUT | Actualizar cultivo |
| `/api/cultivos/:id` | DELETE | Eliminar cultivo |
| **Actividades** | | |
| `/api/actividades` | GET | Listar actividades |
| `/api/actividades/:id` | GET | Obtener actividad |
| `/api/actividades` | POST | Crear actividad |
| `/api/actividades/:id` | PUT | Actualizar actividad |
| `/api/actividades/:id` | DELETE | Eliminar actividad |
| **Inspecciones** | | |
| `/api/inspecciones` | GET | Listar inspecciones |
| `/api/inspecciones/:id` | GET | Obtener inspección |
| `/api/inspecciones` | POST | Crear inspección |
| `/api/inspecciones/:id` | PUT | Actualizar inspección |
| `/api/inspecciones/:id` | DELETE | Eliminar inspección |
| **Acopios** | | |
| `/api/acopios` | GET | Listar acopios |
| `/api/acopios/:id` | GET | Obtener acopio |
| `/api/acopios` | POST | Crear acopio |
| `/api/acopios/:id` | PUT | Actualizar acopio |
| `/api/acopios/:id` | DELETE | Eliminar acopio |
| **Recepciones** | | |
| `/api/recepciones` | GET | Listar recepciones |
| `/api/recepciones/:id` | GET | Obtener recepción |
| `/api/recepciones` | POST | Crear recepción |
| `/api/recepciones/:id` | PUT | Actualizar recepción |
| `/api/recepciones/:id` | DELETE | Eliminar recepción |
| **Procesamientos** | | |
| `/api/procesamientos` | GET | Listar procesamientos |
| `/api/procesamientos/:id` | GET | Obtener procesamiento |
| `/api/procesamientos` | POST | Crear procesamiento |
| `/api/procesamientos/:id` | PUT | Actualizar procesamiento |
| `/api/procesamientos/:id` | DELETE | Eliminar procesamiento |
| **Lotes** | | |
| `/api/lotes` | GET | Listar lotes |
| `/api/lotes/:id` | GET | Obtener lote |
| `/api/lotes` | POST | Crear lote |
| `/api/lotes/:id` | PUT | Actualizar lote |
| `/api/lotes/:id` | DELETE | Eliminar lote |
| **Inventario** | | |
| `/api/inventario` | GET | Listar inventario |
| `/api/inventario/:id` | GET | Obtener item |
| `/api/inventario` | POST | Crear item |
| `/api/inventario/:id` | PUT | Actualizar item |
| `/api/inventario/:id` | DELETE | Eliminar item |
| **Trazabilidad** | | |
| `/api/trazabilidad` | GET | Listar trazabilidad |
| `/api/trazabilidad/:id` | GET | Obtener registro |
| `/api/trazabilidad` | POST | Crear registro |
| `/api/trazabilidad/:id` | PUT | Actualizar registro |
| `/api/trazabilidad/:id` | DELETE | Eliminar registro |
| **Upload** | | |
| `/api/upload` | POST | Subir archivos |

### 4.3 Autenticación

- **JWT Bearer Token**: Se envía en el header `Authorization: Bearer <token>`
- **Roles**: `ADMIN` (acceso total) / `USER` (acceso restringido)
- **Protección**: Rutas marcadas con middleware de autenticación

### 4.4 CORS

Orígenes permitidos (configurables en `.env`):
- `FRONTEND_URL` (principal)
- `FRONTEND_URLS` (adicionales)

---

## 5. Frontend Web

### 5.1 Estructura de Componentes

```
src/
├── App.tsx                  # Componente raíz
├── main.tsx                 # Entry point
├── index.css                # Estilos globales + Tailwind
├── routes/
│   └── AppRoutes.tsx        # Definición de rutas
├── pages/                   # Páginas (una por módulo)
│   ├── auth/                # Login/Register
│   ├── dashboard/           # Panel principal
│   ├── productores/         # Gestión de productores
│   ├── parcelas/            # Gestión de parcelas
│   ├── campañas/            # Gestión de campañas
│   ├── cultivos/            # Gestión de cultivos
│   ├── actividades/         # Gestión de actividades
│   ├── inspecciones/        # Gestión de inspecciones
│   ├── acopio/              # Gestión de acopios
│   ├── recepcion/           # Gestión de recepciones
│   ├── procesamiento/       # Gestión de procesamientos
│   ├── lotes/               # Gestión de lotes
│   ├── inventario/          # Gestión de inventario
│   ├── trazabilidad/        # Gestión de trazabilidad
│   └── catalogos/           # Catálogos/lookup tables
├── components/              # Componentes reutilizables
│   ├── ui/                  # Componentes base (botones, inputs, etc.)
│   ├── shared/              # Componentes compartidos
│   ├── navigation/          # Sidebar/Header
│   ├── map/                 # Componentes de mapa (Leaflet)
│   ├── productores/         # Componentes específicos de productores
│   ├── parcelas/            # Componentes específicos de parcelas
│   ├── cultivos/            # Componentes de cultivos
│   ├── actividades/         # Componentes de actividades
│   ├── inspecciones/        # Componentes de inspecciones
│   ├── acopio/              # Componentes de acopio
│   ├── recepcion/           # Componentes de recepción
│   ├── procesamiento/       # Componentes de procesamiento
│   ├── campanias/           # Componentes de campañas
│   └── ProtectedRoute.tsx   # Ruta protegida por auth
├── contexts/                # React Contexts
├── services/                # Servicios API (Axios)
├── constants/               # Constantes y enums
├── layouts/                 # Layouts (sidebar, header)
└── assets/                  # Imágenes, iconos estáticos
```

### 5.2 Módulos Funcionales

| Módulo | Descripción |
|---|---|
| **Dashboard** | Resumen ejecutivo con métricas clave |
| **Productores** | CRUD completo con datos personales, familiares, documentos |
| **Parcelas** | CRUD con georreferenciación (mapa + polígono) |
| **Campañas** | Gestión de campañas agrícolas con permisos por módulo |
| **Cultivos** | Registro de cultivos con seguimiento fenológico |
| **Actividades** | Planificación y registro de actividades con insumos, mano de obra, maquinaria |
| **Inspecciones** | Inspecciones de campo con checklist y no conformidades |
| **Acopio** | Registro de acopio con pesaje de sacos |
| **Recepción** | Control de calidad y pesaje en planta |
| **Procesamiento** | Transformación del producto con trazabilidad de operaciones |
| **Lotes** | Gestión de lotes y movimientos |
| **Inventario** | Control de existencias con alertas de stock mínimo/máximo |
| **Trazabilidad** | Cadena de trazabilidad completa del producto |

### 5.3 Funcionalidades Destacadas

- **Mapas interactivos** (Leaflet) para georreferenciación de parcelas
- **Dibujo de polígonos** (leaflet-draw) para delimitar parcelas
- **Cálculo de área** (Turf.js) a partir de polígonos
- **Firma digital** (captura de firma para acopios y recepciones)
- **Control de calidad** con checklists y no conformidades
- **Gestión de evidencias** (fotos, documentos adjuntos)
- **Historial** de cambios en registros críticos
- **Modo oscuro** / claro
- **Responsive** para tabletas

---

## 6. Flujo del Negocio

### 6.1 Ciclo Productivo Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CICLO PRODUCTIVO                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. CAMPAÑA ──▶ 2. PARCELAS ──▶ 3. CULTIVOS ──▶ 4. ACTIVIDADES    │
│     (Planificar)   (Georref.)    (Registrar)     (Ejecutar)        │
│                                                                     │
│  5. INSPECCIONES ──▶ 6. ACOPIO ──▶ 7. RECEPCIÓN ──▶ 8. PROCESAMIENTO│
│     (Verificar)      (Recolectar)  (Control Cal.)  (Transformar)   │
│                                                                     │
│  9. LOTES ──▶ 10. INVENTARIO ──▶ 11. TRAZABILIDAD                   │
│     (Almacenar)   (Control Stock)  (Seguimiento Completo)          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Descripción por Fase

| # | Fase | Descripción |
|---|---|---|
| 1 | **Campaña** | Se crea una campaña agrícola definiendo periodos y permisos |
| 2 | **Parcelas** | Se registran y georreferencian las parcelas de cada productor |
| 3 | **Cultivos** | Se registran los cultivos por parcela y campaña |
| 4 | **Actividades** | Se planifican y ejecutan actividades (siembra, fertilización, etc.) |
| 5 | **Inspecciones** | Se realizan inspecciones de campo con checklists |
| 6 | **Acopio** | Se recolecta el producto en campo con pesaje por saco |
| 7 | **Recepción** | Se recibe en planta con control de calidad y pesaje |
| 8 | **Procesamiento** | Se transforma el producto (trilla, limpieza, etc.) |
| 9 | **Lotes** | Se generan lotes con control de peso y movimientos |
| 10 | **Inventario** | Se registra en almacén con alertas de stock |
| 11 | **Trazabilidad** | Se registra la cadena completa del producto |

---

## 7. Configuración

### 7.1 Variables de Entorno

#### `packages/database/.env`
```env
DATABASE_URL="mysql://usuario:password@localhost:3306/agrodata"
```

#### `apps/api/.env`
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="mysql://usuario:password@localhost:3306/agrodata"
JWT_SECRET="tu-secreto-jwt-aqui"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
FRONTEND_URLS=""
```

### 7.2 Comandos Principales

```bash
# Instalación
npm install

# Desarrollo (API + Web simultáneamente)
npm run dev

# Base de datos
npm run db:migrate      # Ejecutar migraciones
npm run db:seed         # Sembrar datos de prueba
npm run db:reset        # Resetear BD completa
npm run db:studio       # Abrir Prisma Studio
npm run db:push         # Sync esquema sin migraciones

# Build
npm run build

# Lint
npm run lint
```

### 7.3 Datos de Prueba (Seed)

| Email | Password | Rol |
|---|---|---|
| admin@agrodata.com | Admin123! | ADMIN |
| carlos.mendoza@agrodata.com | Demo123! | USER |
| maria.garcia@agrodata.com | Demo123! | USER |

---

## 8. Estructura de Archivos del API

```
apps/api/src/
├── server.ts              # Punto de entrada, levanta el servidor
├── app.ts                 # Configuración de Express (middleware, rutas)
├── config/
│   └── env.ts             # Variables de entorno tipadas
├── controllers/           # Lógica de negocio por módulo
│   ├── auth.controller.ts
│   ├── usuarios.controller.ts
│   ├── productores.controller.ts
│   ├── parcelas.controller.ts
│   ├── campanias.controller.ts
│   ├── cultivos.controller.ts
│   ├── actividades.controller.ts
│   ├── inspecciones.controller.ts
│   ├── acopios.controller.ts
│   ├── recepcion.controller.ts
│   ├── procesamiento.controller.ts
│   ├── lotes.controller.ts
│   ├── inventario.controller.ts
│   └── trazabilidad.controller.ts
├── services/              # Capa de acceso a datos (Prisma)
│   ├── auth.service.ts
│   ├── usuarios.service.ts
│   ├── productores.service.ts
│   ├── parcelas.service.ts
│   ├── campanias.service.ts
│   ├── cultivos.service.ts
│   ├── actividades.service.ts
│   ├── inspecciones.service.ts
│   ├── acopios.service.ts
│   ├── recepcion.service.ts
│   ├── procesamiento.service.ts
│   ├── lotes.service.ts
│   ├── inventario.service.ts
│   └── trazabilidad.service.ts
├── routes/                # Definición de rutas Express
│   ├── auth.routes.ts
│   ├── usuarios.routes.ts
│   ├── productores.routes.ts
│   ├── parcelas.routes.ts
│   ├── campanias.routes.ts
│   ├── cultivos.routes.ts
│   ├── actividades.routes.ts
│   ├── inspecciones.routes.ts
│   ├── acopios.routes.ts
│   ├── recepcion.routes.ts
│   ├── procesamiento.routes.ts
│   ├── lotes.routes.ts
│   ├── inventario.routes.ts
│   ├── trazabilidad.routes.ts
│   └── upload.routes.ts
├── validators/            # Validación con Joi
├── middleware/             # Middleware (auth, error handler)
└── uploads/               # Directorio de archivos subidos
```

---

## 9. Base de Datos - Migraciones

| Migración | Descripción |
|---|---|
| `20260804051117_init` | Esquema inicial (usuarios, productores, etc.) |
| `20260804052026_add_productores` | Módulo de productores |
| `20260806123000_add_parcelas_module` | Módulo de parcelas |
| `20260807000000_add_parcela_poligono` | Campo polígono GeoJSON |

---

## 10. Seguridad

- **Helmet**: Headers HTTP seguros
- **CORS**: Control de orígenes permitidos
- **JWT**: Autenticación basada en tokens
- **bcrypt**: Hash de contraseñas
- **Validación Joi**: Sanitización de entradas
- **Soft delete**: Campos `activo` para borrado lógico
- **Auditoría**: Campos `created_by`, `updated_by`, `created_at`, `updated_at`

---

## 11. Notas de Arquitectura

1. **Fuente única de verdad**: El modelo de datos vive en `packages/database` y es compartido por todas las aplicaciones
2. **Prisma Client compartido**: Se genera en el `node_modules` raíz y es consumido por todos los workspaces
3. **API como capa única**: Toda la comunicación con la BD se realiza a través del API REST
4. **Escalabilidad modular**: Cada módulo (productores, parcelas, etc.) sigue el patrón Controller → Service → Prisma
5. **Extensible a móvil**: Para agregar una app móvil, crear carpeta en `apps/` y agregar a workspaces
