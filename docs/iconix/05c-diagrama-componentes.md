# Diagrama de Componentes — Aplicación Móvil (Anexo UML)

> **Alcance:** diagrama de componentes UML de la aplicación móvil (`apps/mobile`) y su
> relación con los componentes del API (`apps/api`).
>
> **Notación Mermaid:** se emula el componente UML con `[[texto]]` (forma de subrutina,
> visualmente equivalente al símbolo de componente) y las **interfaces** con `((o))`
> (círculo = *provided*; círculo con unión discontinua = *required*).
>
> **Estructura verificada** en `apps/mobile/src/` y `apps/api/src/`:
> móvil → `components/{ui,layouts,map}`, `constants`, `contexts`, `hooks`, `navigation`,
> `screens`, `services`, `theme`, `utils`. API → `config`, `controllers`, `middleware`,
> `routes`, `services`, `types`, `validators`, `__tests__`.

**Contenido**
1. [Componentes de la aplicación móvil](#1-componentes-de-la-aplicación-móvil)
2. [Componentes del sistema completo](#2-componentes-del-sistema-completo)
3. [Catálogo de componentes](#3-catálogo-de-componentes)
4. [Interfaces y contratos](#4-interfaces-y-contratos)

---

## 1. Componentes de la aplicación móvil

Vista interna: capas del móvil y dependencias entre sus componentes.

```mermaid
flowchart TB
    %% ══════════════ CAPA DE PRESENTACIÓN ══════════════
    subgraph UI["Capa de presentación"]
        direction TB
        PANTALLAS[["Screens<br/>(38 pantallas)<br/>&lt;&lt;component&gt;&gt;"]]
        LAYOUTS[["components/layouts<br/>Detail · Form · List · Menu<br/>&lt;&lt;component&gt;&gt;"]]
        WIDGETS[["components/ui<br/>Badge · Card · SelectField ·<br/>KpiGrid · InfoRow · … (15)<br/>&lt;&lt;component&gt;&gt;"]]
        MAPA[["components/map<br/>Mapas<br/>&lt;&lt;component&gt;&gt;"]]
    end

    %% ══════════════ CAPA DE NAVEGACIÓN ══════════════
    subgraph NAV["Capa de navegación"]
        direction TB
        NAVIGATOR[["AppNavigator + AppStacks<br/>&lt;&lt;component&gt;&gt;"]]
    end

    %% ══════════════ CAPA DE ESTADO ══════════════
    subgraph STATE["Capa de estado"]
        direction TB
        HOOKS[["hooks (TanStack Query)<br/>useProductores · useCampo ·<br/>useInspecciones · useKardex ·<br/>useOrdenes · useRecepciones · …<br/>&lt;&lt;component&gt;&gt;"]]
        THEME[["ThemeContext + theme<br/>&lt;&lt;component&gt;&gt;"]]
    end

    %% ══════════════ CAPA DE DATOS ══════════════
    subgraph DATA["Capa de datos"]
        direction TB
        SERVICIOS[["services<br/>productores · campo · inspecciones ·<br/>recepciones · kardex · ordenes ·<br/>catalogos · ubigeo · dashboard<br/>&lt;&lt;component&gt;&gt;"]]
        HTTP[["api.ts<br/>Axios + interceptor de refresh<br/>&lt;&lt;component&gt;&gt;"]]
        AUTH[["auth.ts<br/>login · refresh · logout<br/>&lt;&lt;component&gt;&gt;"]]
    end

    %% ══════════════ CAPA DE SOPORTE ══════════════
    subgraph SUPPORT["Capa de soporte"]
        direction TB
        LOCAL[["Persistencia local<br/>SecureStore + AsyncStorage<br/>&lt;&lt;component&gt;&gt;"]]
        UTILS[["utils<br/>fechas · utm · alertas · toast ·<br/>statusConfig<br/>&lt;&lt;component&gt;&gt;"]]
        CONST[["constants/options<br/>&lt;&lt;component&gt;&gt;"]]
    end

    %% ══════════════ INTERFACES ══════════════
    I_REST(("REST API"))
    I_SENSORS(("GPS / Cámara"))

    %% ══════════════ DEPENDENCIAS ══════════════
    NAVIGATOR --> PANTALLAS
    PANTALLAS --> LAYOUTS
    PANTALLAS --> WIDGETS
    PANTALLAS --> MAPA
    PANTALLAS --> HOOKS
    LAYOUTS --> WIDGETS
    MAPA --> UTILS
    WIDGETS --> THEME

    HOOKS --> SERVICIOS
    HOOKS --> UTILS
    SERVICIOS --> HTTP
    SERVICIOS --> AUTH
    AUTH --> LOCAL
    HTTP -.->|"requires"| I_REST
    PANTALLAS -.->|"requires"| I_SENSORS

    UTILS --> CONST
    PANTALLAS --> UTILS

    %% ══════════════ ESTILOS ══════════════
    classDef component fill:#e8f5e9,stroke:#2e7d32,color:#000;
    classDef iface     fill:#fff3e0,stroke:#ef6c00,color:#000;
    classDef layer     fill:#e3f2fd,stroke:#1565c0,color:#000;

    class PANTALLAS,LAYOUTS,WIDGETS,MAPA,NAVIGATOR,HOOKS,THEME,SERVICIOS,HTTP,AUTH,LOCAL,UTILS,CONST component
    class I_REST,I_SENSORS iface
```

---

## 2. Componentes del sistema completo

Vista de alto nivel: móvil ↔ API ↔ base de datos, con las interfaces que cada uno
**provee** (círculo) y **requiere**.

```mermaid
flowchart LR
    %% ══════════════ DISPOSITIVO MÓVIL ══════════════
    subgraph MOB["📱 Aplicación Móvil · Expo 57 / RN 0.86"]
        direction TB
        M_UI[["Interfaz de usuario<br/>(screens + components)<br/>&lt;&lt;component&gt;&gt;"]]
        M_STATE[["Gestión de estado<br/>(hooks + contexts)<br/>&lt;&lt;component&gt;&gt;"]]
        M_DATA[["Capa de datos<br/>(services + api.ts)<br/>&lt;&lt;component&gt;&gt;"]]
        M_NAV[["Navegación<br/>(AppNavigator)<br/>&lt;&lt;component&gt;&gt;"]]
    end

    %% ══════════════ SERVIDOR API ══════════════
    subgraph API["🖥️ API REST · Express 4.21 / Node.js 22"]
        direction TB
        A_ROUTES[["routes (18 módulos)<br/>&lt;&lt;component&gt;&gt;"]]
        A_MW[["middleware<br/>auth · admin · validate ·<br/>rate-limit · error<br/>&lt;&lt;component&gt;&gt;"]]
        A_CTRL[["controllers (18)<br/>&lt;&lt;component&gt;&gt;"]]
        A_SVC[["services (Prisma)<br/>&lt;&lt;component&gt;&gt;"]]
        A_VAL[["validators (Joi, 14)<br/>&lt;&lt;component&gt;&gt;"]]
        A_CFG[["config/env<br/>&lt;&lt;component&gt;&gt;"]]
        A_UPLOAD[["upload (Multer)<br/>&lt;&lt;component&gt;&gt;"]]
        A_TYPES[["@agrodata/types<br/>&lt;&lt;component&gt;&gt;"]]
    end

    %% ══════════════ PERSISTENCIA ══════════════
    subgraph DB["🗄️ MySQL 8"]
        D_PRISMA[["Prisma Client 6.10<br/>&lt;&lt;component&gt;&gt;"]]
        D_SCHEMA[("agrodata<br/>30 tablas")]
    end
    F_STORE[["uploads/<br/>&lt;&lt;artifact&gt;&gt;"]]

    %% ══════════════ INTERFACES ══════════════
    I_REST(("Interfaz REST<br/>/api/*"))
    I_JWT(("Interfaz de<br/>autenticación JWT"))
    I_FILES(("Interfaz de<br/>archivos"))

    %% ══════════════ RELACIONES ══════════════
    M_UI --> M_NAV
    M_UI --> M_STATE
    M_STATE --> M_DATA
    M_DATA -.->|"requires"| I_REST
    M_DATA -.->|"requires"| I_JWT

    I_REST -.- A_ROUTES
    I_JWT -.- A_MW

    A_ROUTES --> A_MW
    A_MW --> A_VAL
    A_VAL --> A_CTRL
    A_CTRL --> A_SVC
    A_SVC --> D_PRISMA
    D_PRISMA --> D_SCHEMA
    A_UPLOAD --> F_STORE
    A_UPLOAD -.->|"provides"| I_FILES
    A_TYPES -.->|"shared"| M_DATA
    A_TYPES -.->|"shared"| A_SVC
    A_CFG -.-> A_ROUTES

    %% ══════════════ ESTILOS ══════════════
    classDef component fill:#e8f5e9,stroke:#2e7d32,color:#000;
    classDef iface     fill:#fff3e0,stroke:#ef6c00,color:#000;
    classDef db        fill:#fce4ec,stroke:#c2185b,color:#000;

    class M_UI,M_STATE,M_DATA,M_NAV,A_ROUTES,A_MW,A_CTRL,A_SVC,A_VAL,A_CFG,A_UPLOAD,A_TYPES component
    class I_REST,I_JWT,I_FILES iface
    class D_PRISMA,F_STORE component
    class D_SCHEMA db
```

---

## 3. Catálogo de componentes

### 3.1 Aplicación móvil (`apps/mobile/src/`)

| Componente | Archivos / contenido | Responsabilidad |
|---|---|---|
| **Screens** | 38 pantallas (`screens/`) | Interfaces de usuario por módulo |
| **components/layouts** | `DetailScreenLayout`, `FormScreenLayout`, `ListScreenLayout`, `MenuScreenLayout` | Plantillas reutilizables de pantalla |
| **components/ui** | `Badge`, `Card`, `ConfirmDialog`, `CustomHeader`, `DatePickerField`, `EmptyState`, `HeaderUsuario`, `InfoRow`, `KpiGrid`, `LoadingSpinner`, `PageHeader`, `SearchInput`, `SectionHeader`, `SelectField`, `UbigeoSelect` (15) | Controles visuales base |
| **components/map** | `Mapas` | Visualización geográfica (parcelas, actividades) |
| **navigation** | `AppNavigator`, `AppStacks`, `types` | Árbol de navegación (tabs + stacks) |
| **hooks** | `useProductores`, `useCampo`, `useActividades`, `useInspecciones`, `useRecepciones`, `useKardex`, `useOrdenes`, `useDashboard`, `useUbigeo`, `useUsuarioActual`, `useLogout`, `useDebounce`, `acumularLista` | Consultas y mutaciones (TanStack Query) |
| **services** | `api`, `auth`, `productores`, `campo`, `actividades`, `inspecciones`, `recepciones`, `kardex`, `ordenes`, `catalogos`, `ubigeo`, `dashboard`, `index` | Acceso al API + transformación `*ToBackend`/`*ToFrontend` |
| **contexts** | `ThemeContext` | Tema visual global |
| **theme** | `index`, `tokens` | Tokens de diseño |
| **constants** | `options` | Opciones de formularios |
| **utils** | `fechas`, `utm`, `alertas`, `toast`, `statusConfig` | Utilidades transversales |

### 3.2 API REST (`apps/api/src/`)

| Componente | Contenido | Responsabilidad |
|---|---|---|
| **routes** | 18 archivos (`*.routes.ts`) | Definición de endpoints y `adminMiddleware` |
| **middleware** | `auth.middleware`, `validate.middleware` (+ error handler) | Autenticación, autorización, validación, rate limit |
| **controllers** | 18 controladores | Lógica de orquestación por módulo |
| **services** | Servicios Prisma | Acceso a datos |
| **validators** | 14 esquemas Joi | Reglas de negocio e invariantes |
| **config** | `env.ts` | Variables de entorno tipadas |
| **types** | `usuarios.types`, etc. | Tipos compartidos |
| **__tests__** | Pruebas | Verificación |

### 3.3 Paquete compartido

| Componente | Contenido | Consumido por |
|---|---|---|
| `@agrodata/types` | Tipos TS compartidos | Móvil y API |

---

## 4. Interfaces y contratos

| Interfaz | Tipo | Proveedor | Requerido por | Contrato |
|---|---|---|---|---|
| **Interfaz REST** `/api/*` | *provided* por API | `routes` | `services` del móvil | JSON sobre HTTPS; 18 módulos |
| **Interfaz de autenticación** | *provided* por API | `auth.middleware` | `api.ts` (interceptor) | JWT Bearer + refresh rotativo |
| **Interfaz de archivos** | *provided* por API | `upload` (Multer) | Formularios (fotos, firmas) | `multipart/form-data` |
| **Persistencia local** | *provided* por SO | `expo-secure-store`, `AsyncStorage` | `auth.ts` | Almacenamiento seguro/opaco |
| **GPS / Cámara** | *provided* por hardware | `expo-location`, Cámara | Parcelas, actividades, inspecciones | Coordenadas + archivos |
| **`@agrodata/types`** | *shared* | `packages/types` | Móvil y API | Contrato de tipos TS |

### Dependencias clave observadas

- `Screens` **no** hablan directamente con el API: pasan por `hooks` → `services` → `api.ts`
  (**excepción**: las pantallas de **Acopios** llaman `api.*` directamente, deuda R-1).
- `services` es el **único** componente con conocimiento del mapeo `snake_case ↔ camelCase`.
- `auth.ts` encapsula el ciclo de vida del token (login, refresh, logout) y es consumido por
  el interceptor de `api.ts`.
- `@agrodata/types` garantiza el **contrato compartido** entre móvil y API (patrón
  "contrato primero").

---

> **Relación con ICONIX:** este diagrama muestra **cómo se organizan** los componentes que
> implementan las clases (Parte 5) y que ejecutan los casos de uso (Parte 2). La Parte 6
> (Matriz de Trazabilidad) cierra la cadena.
