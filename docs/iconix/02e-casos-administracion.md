# Casos de Uso — Administración y Panel (ICONIX · Parte 2e)

Continuación de `02-casos-de-uso.md`. Módulo **Administración**: usuarios y catálogos; y el
**Panel de control** (Dashboard). Se incluye un caso de uso de **apoyo** (ubigeo/catalogos de
consulta) que consumen el resto de formularios.

---

# MÓDULO: ADMINISTRACIÓN

> En el móvil actual **no existen pantallas** para estos casos de uso (el API sí los expone);
> se documentan porque son prerequisito de negocio y porque el móvil consume catálogos y
> ubigeo como datos de apoyo. Ver "Deuda de alcance" al final.

## UC-21 · Gestionar usuarios

### UC-21.1 · Listar y filtrar usuarios

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Objetivo** | Ver las cuentas del sistema y sus roles. |
| **Entidades** | `Usuario` |
| **Endpoints** | `GET /api/usuarios`, `GET /api/usuarios/basic` |

**Flujo normal**
1. `GET /api/usuarios` **exige `ADMIN`**; devuelve lista paginada.
2. Filtra por `search`, `rol` (ADMIN/USER) y `rol_sic`.
3. `GET /api/usuarios/basic` (sin ADMIN) devuelve un listado reducido (p. ej. responsables).

**Reglas**
- **RN-1:** `limit` por defecto 20, máx. 500.
- **RN-2:** `rol` ∈ {ADMIN, USER}; `rol_sic` ∈ {RESPONSABLE_SIC, INSPECTOR, COMITE_DECISION,
  TECNICO_CAMPO, ACOPIADOR, CAPACITADOR}.

### UC-21.2 · Crear usuario

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Endpoints** | `POST /api/usuarios` |

**Reglas de negocio** (de `createUsuarioSchema`)
- **RN-1:** `nombre` (2–100), `email` (formato válido) y `password` (6–50) obligatorios.
- **RN-2:** `rol` por defecto `USER`; `rol_sic` opcional.
- **RN-3:** no puede repetirse el `email` (unicidad).

### UC-21.3 · Editar usuario

- **Actor:** Administrador. **Endpoints:** `GET /api/usuarios/:id`, `PUT /api/usuarios/:id`.
- **Reglas:** `PUT` con al menos un campo (`min(1)`); permite `nombre`, `email`, `password`,
  `rol`, `rol_sic` y `activo`.

### UC-21.4 · Eliminar usuario

- **Actor:** Administrador. **Endpoint:** `DELETE /api/usuarios/:id`.

### UC-21.5 · Editar mi propio perfil

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario (cualquiera autenticado) |
| **Objetivo** | Actualizar los datos propios sin poder cambiar el rol. |
| **Endpoints** | `PATCH /api/usuarios/me` |

**Reglas de negocio** (de `updateMeSchema`)
- **RN-1:** solo permite `nombre`, `email` y `password`; **nunca** `rol`, `rol_sic` ni `activo`.
- **RN-2:** al menos un campo (`min(1)`); `password` 6–50.

---

## UC-22 · Gestionar catálogos

### UC-22.1 · Consultar catálogos (apoyo de formularios)

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Objetivo** | Alimentar los desplegables (comunidades, tipos de suelo, etc.). |
| **Entidades** | `CatalogoItem` |
| **Endpoints** | `GET /api/catalogos/:tipo`, `GET /api/catalogos/:tipo/activos`, `GET /api/catalogos/item/:id` |

**Reglas**
- **RN-1:** `tipo` ∈ {departamentos, tipos-cultivo, tipos-suelo, fuentes-agua, sistemas-riego,
  zonas-agroecologicas, tipos-actividad, tipos-documento, parentescos, criterios-checklist}.
- **RN-2:** `getActivos` devuelve solo ítems `activo = true` (para dropdowns).
- **RN-3:** `limit` por defecto 50, máx. 500.

### UC-22.2 · Crear / editar / activar / eliminar ítem de catálogo

| Campo | Detalle |
|---|---|
| **Actor primario** | Administrador |
| **Endpoints** | `POST /api/catalogos/:tipo`, `PUT /api/catalogos/item/:id`, `PATCH /api/catalogos/item/:id/toggle`, `DELETE /api/catalogos/item/:id` |

**Reglas de negocio** (de `catalogos.validator.ts`)
- **RN-1:** `nombre` (≤100) obligatorio; `descripcion` (≤500) opcional.
- **RN-2:** `activo` por defecto true; `orden` ≥ 0 (por defecto 0).
- **RN-3:** `toggle` cambia `activo` sin eliminar (baja lógica preferida).
- **RN-4:** actualización con al menos un campo (`min(1)`).

---

# MÓDULO: PANEL

## UC-23 · Ver panel de control (Dashboard)

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Objetivo** | Obtener una vista resumida del estado del sistema. |
| **Precondiciones** | Sesión activa. |
| **Entidades** | `Productor`, `Parcela`, `Cultivo`, `Campania`, `Actividad` |
| **Pantalla** | `DashboardScreen` |
| **Endpoints** | `GET /api/productores?limit=1`, `GET /api/parcelas?limit=1`, `GET /api/cultivos?limit=1`, `GET /api/campanias?limit=50`, `GET /api/actividades?limit=5&sort=created_at:desc` |

**Flujo normal**
1. El sistema ejecuta en **paralelo** (tolerante a fallos individuales, `Promise.allSettled`).
2. Obtiene los **totales**: productores, parcelas, cultivos.
3. Detecta la **campaña activa** (`estado = ACTIVA`) entre las campañas listadas.
4. Obtiene las **5 actividades recientes**.
5. Compone las tarjetas de KPI y la lista de actividades recientes.

**Flujos alternos**
- **A1 (fallo parcial):** si una fuente falla, su tarjeta muestra `0`/vacío sin romper la pantalla.

**Reglas de negocio**
- **RN-1:** el panel no requiere rol específico; es tolerante a fallos por consulta.

---

# CASOS DE USO DE APOYO

## UC-24 · Consultar datos geográficos (Ubigeo)

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario |
| **Objetivo** | Seleccionar departamento/provincia/distrito en formularios. |
| **Entidades** | `Ubigeo` |
| **Endpoints** | `GET /api/ubigeo/departamentos`, `.../departamentos/:dpto/provincias`, `.../provincias/:prov/distritos`, `GET /api/ubigeo/codigo/:codigo`, `GET /api/ubigeo` |

**Flujo normal:** el formulario (parcela/productor) carga departamentos y, en cascada,
provincias y distritos; guarda el `ubigeo`/`ubigeo_id` seleccionado.

---

## UC-25 · Adjuntar archivos (servicio de carga)

| Campo | Detalle |
|---|---|
| **Actor primario** | Usuario autenticado |
| **Objetivo** | Subir documentos, fotos y firmas. |
| **Actor secundario** | Servicio de archivos |
| **Endpoints** | `POST /api/upload/*` (según `upload.routes.ts`) |

**Flujo normal:** el móvil envía el archivo (multipart); el API lo almacena y devuelve la
`ruta_archivo`, que luego se asocia a documentos/fotos/evidencias/firmas.

---

## Deuda de alcance (a resolver)

| # | Hallazgo | Impacto |
|---|---|---|
| D-1 | El móvil **no tiene pantallas** de UC-21 (usuarios) ni UC-22 (catálogos). | La app web los cubre; el móvil los consume como datos de apoyo. |
| D-2 | Pantallas de **Procesamiento** existen pero **no están cableadas** en `AppStacks`. | UC-19 no es accesible desde la navegación. |
| D-3 | El móvil **no oculta la UI de escritura** según rol; el usuario ve el 403 al guardar. | Mala UX y deuda de seguridad. |
| D-4 | Rutas de escritura sin `ADMIN` en órdenes y en `kardex/salidas`, `kardex/:id/baja`. | Inconsistencia de autorización (RN-OPS-0). |

---

**Fin de la Parte 2.** Continúa la **Parte 3 — Análisis de Robustez** (boundary/entity/control)
por caso de uso.
